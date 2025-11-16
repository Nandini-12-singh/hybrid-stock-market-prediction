import os
import sys
import numpy as np
import pandas as pd
import pandas_ta as ta
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dropout, Dense
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
from datetime import datetime, timedelta



def create_sequences(series: np.ndarray, look_back: int = 60):
    """
    Given a 2D array (n_samples, n_features), create X of shape (n_samples-look_back, look_back, n_features)
    and y of shape (n_samples-look_back,) where y is the close price at t+look_back.
    """
    X, y = [], []
    for i in range(look_back, len(series)):
        X.append(series[i - look_back:i, :])
        y.append(series[i, 0])  # y is the close price (first column)
    X = np.array(X)
    y = np.array(y)
    return X, y


def build_lstm_model(input_timesteps: int = 60, input_features: int = 1) -> Sequential:
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(input_timesteps, input_features)),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(1),  # predict normalized price
    ])
    model.compile(optimizer='adam', loss='mse')
    return model


def train_and_convert_model():

    # 1) Real historical data: fetch 5 years of daily data for AAPL using yfinance
    ticker = "AAPL"
    end = datetime.utcnow().date()
    start = end - timedelta(days=365 * 5 + 30)  # ~5 years (+buffer)
    print(f"Fetching historical data for {ticker} from {start} to {end}...")
    # Prefer the Ticker.history API (used in predict.py) for consistent results
    try:
        ticker_obj = yf.Ticker(ticker)
        df = ticker_obj.history(period="5y", interval="1d", actions=False)
    except Exception:
        df = yf.download(ticker, start=start.isoformat(), end=end.isoformat(), interval="1d", progress=False)

    if df is None or df.empty:
        raise RuntimeError(f"Failed to download historical data for {ticker}. Dataframe empty.")
    # Ensure index is sorted oldest -> newest
    df = df.sort_index()
    if 'Close' not in df.columns:
        raise RuntimeError(f"Downloaded data for {ticker} does not contain a 'Close' column. Columns: {df.columns.tolist()}")
    # Quick diagnostics
    print(f"Downloaded {len(df)} rows. Close NaNs: {int(df['Close'].isna().sum())}")

    # 2) Add technical indicators (RSI, MACD)
    df['RSI'] = ta.rsi(df['Close'], length=14)
    macd = ta.macd(df['Close'], fast=12, slow=26, signal=9)
    # pandas_ta.macd may return None in some edge cases; provide a robust fallback
    if macd is None or 'MACD_12_26_9' not in getattr(macd, 'columns', []):
        # Fallback: compute MACD line manually (ema12 - ema26)
        ema_fast = df['Close'].ewm(span=12, adjust=False).mean()
        ema_slow = df['Close'].ewm(span=26, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal = macd_line.ewm(span=9, adjust=False).mean()
        # Use MACD line minus signal (histogram) as a robust indicator, but keep numerical range similar
        df['MACD'] = macd_line - signal
    else:
        df['MACD'] = macd['MACD_12_26_9']

    # Fill missing values (from indicator warmup) with forward fill then back fill
    df = df.fillna(method='ffill').fillna(method='bfill')

    # Keep only the columns we need and drop any remaining NaNs (robustness)
    df = df[['Close', 'RSI', 'MACD']].dropna()
    df = df.reset_index(drop=True)

    if len(df) < 200:
        raise RuntimeError(f"Insufficient cleaned data for training (need >200 rows), got {len(df)} rows")

    # 3) Data Preparation: MinMaxScaler fit on features [Close, RSI, MACD]
    scaler = MinMaxScaler(feature_range=(0, 1))
    features = df[['Close', 'RSI', 'MACD']].values
    normalized = scaler.fit_transform(features)

    # Print min/max reminder for manual backend updates
    data_min = scaler.data_min_[0]
    data_max = scaler.data_max_[0]
    print(f"[Scaler] data_min={data_min:.6f}, data_max={data_max:.6f}")
    print("Reminder: update SCALER_MIN and SCALER_MAX in backend/model.js to these values.")

    # 4) LSTM Data Shaping: sequences X (60, 3) and target Y (61st close)
    look_back = 60
    X, y = create_sequences(normalized, look_back)
    # X shape: (samples, timesteps, features=3)

    # 5) Train/test split
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # 6) LSTM Model Definition
    model = build_lstm_model(input_timesteps=look_back, input_features=3)

    # 7) Model Compilation and Fit: longer training run on real data
    epochs = 50
    batch_size = 32
    print(f"Training model: epochs={epochs}, batch_size={batch_size}, samples={len(X_train)}")
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_split=0.1, verbose=1)

    # 8) Evaluate on test set
    y_pred = model.predict(X_test)
    # De-normalize predictions and targets
    y_pred_denorm = y_pred.flatten() * (data_max - data_min) + data_min
    y_test_denorm = y_test * (data_max - data_min) + data_min

    # RMSE and MAE
    rmse = np.sqrt(mean_squared_error(y_test_denorm, y_pred_denorm))
    mae = mean_absolute_error(y_test_denorm, y_pred_denorm)

    # Directional Accuracy
    direction_true = np.sign(np.diff(y_test_denorm))
    direction_pred = np.sign(np.diff(y_pred_denorm))
    da = np.mean(direction_true == direction_pred) * 100

    print(f"\nModel Evaluation Metrics:")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAE: {mae:.2f}")
    print(f"Directional Accuracy: {da:.1f}%\n")

    # 9) Prepare output dir and persist a Keras model for Python inference
    target_dir = os.path.join(os.path.dirname(__file__), 'backend', 'model')
    os.makedirs(target_dir, exist_ok=True)
    keras_model_path = os.path.join(target_dir, 'model.keras')
    model.save(keras_model_path)
    print(f"Saved Keras model to: {keras_model_path}")

    # Optional: try to export a TFJS-compatible model if tensorflowjs is available.
    # This is non-critical for Python inference; we handle conversion errors gracefully.
    try:
        temp_keras_model_path = os.path.join(os.path.dirname(__file__), 'temp_keras_model.h5')
        model.save(temp_keras_model_path)
        try:
            import tensorflowjs as tfjs
            # Save a TFJS model into the same target_dir
            tfjs.converters.save_keras_model(model, target_dir)
            print(f"Saved TFJS model to: {os.path.join(target_dir, 'model.json')}")
        except Exception as e:
            print(f"TFJS conversion skipped or failed: {e}")
        finally:
            try:
                os.remove(temp_keras_model_path)
            except Exception:
                pass
    except Exception as e:
        print(f"Warning: failed to create temporary h5 model or convert to TFJS: {e}")


if __name__ == '__main__':
    train_and_convert_model()