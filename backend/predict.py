import os
import sys
import json
import time
import argparse
import numpy as np
import tensorflow as tf
import yfinance as yf
import warnings
import requests
import pandas as pd
import pandas_ta as ta
import traceback
from datetime import datetime, timedelta
from data_source import fetch_data_from_sheet, is_supported_ticker

# Suppress all warnings
warnings.filterwarnings('ignore')

# Constants for retry mechanism
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds between retries

def create_custom_session():
    """Create a custom requests session with browser-like headers"""
    session = requests.Session()
    
    # Headers that mimic a common browser request
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'DNT': '1'  # Do Not Track
    })
    
    return session

# Suppress tensorflow logging
tf.get_logger().setLevel('ERROR')

# Function to ensure clean JSON output
def print_json(data):
    # Clear any buffered output
    sys.stdout.flush()
    # Print JSON and flush immediately
    print(json.dumps(data), flush=True)


def fetch_stock_data(ticker_symbol):
    try:
        if not ticker_symbol or not isinstance(ticker_symbol, str):
            print_json({
                "error": "ERROR_DATA_FETCH: Invalid ticker symbol provided."
            })
            return None

        # Standardize ticker format
        ticker_symbol = ticker_symbol.strip().upper()

        df = None
        last_error = None

        # Try mock/Google Sheets data source first
        if is_supported_ticker(ticker_symbol):
            try:
                df = fetch_data_from_sheet(ticker_symbol)
            except Exception as e:
                last_error = f"Mock/Sheets error: {str(e)}"

        # If not supported by mock, or mock failed, try yfinance as fallback
        if df is None or df.empty or 'Close' not in df.columns:
            # Try a robust progressive fetch strategy to guarantee enough trading days
            # 1) Try period shortcuts (180d, 365d, max)
            # 2) If insufficient, try explicit start/end windows with increasing lookback days
            periods_to_try = ["180d", "365d", "max"]
            days_back_options = [180, 270, 365, 540, 720]
            session = None
            try:
                session = create_custom_session()
                ticker_obj = yf.Ticker(ticker_symbol, session=session)
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    info = ticker_obj.info
                    if not info or not isinstance(info, dict) or 'regularMarketPrice' not in info:
                        last_error = f"YFinance info check failed for '{ticker_symbol}'"

                # Try the simple period-based calls first
                for period in periods_to_try:
                    try:
                        cand = ticker_obj.history(
                            period=period,
                            interval="1d",
                            actions=False,
                            timeout=10
                        )
                        if cand is not None and not cand.empty and 'Close' in cand.columns:
                            # quick check: prefer at least 60 trading days (minimum required for model input)
                            if len(cand.dropna(subset=['Close'])) >= 60:
                                df = cand
                                break
                            else:
                                # keep candidate as fallback but continue trying larger window
                                df = cand
                    except Exception as pe:
                        last_error = f"YFinance history error ({period}): {str(pe)}"
                        continue

                # If period-based attempts didn't yield enough rows, try explicit start/end windows
                if df is None or df.dropna(subset=['Close']).shape[0] < 60:
                    end = datetime.utcnow().date()
                    for days in days_back_options:
                        try:
                            start = end - timedelta(days=days)
                            # Prefer yf.download for a direct CSV-like fetch which can be more reliable
                            try:
                                cand2 = yf.download(ticker_symbol, start=start.isoformat(), end=end.isoformat(), interval="1d", progress=False, threads=False)
                            except Exception:
                                # Fallback to Ticker.history if download fails
                                cand2 = ticker_obj.history(start=start.isoformat(), end=end.isoformat(), interval="1d", actions=False, timeout=10)

                            if cand2 is not None and not cand2.empty and 'Close' in cand2.columns:
                                if len(cand2.dropna(subset=['Close'])) >= 60:
                                    df = cand2
                                    break
                                else:
                                    # keep as fallback and try a larger window
                                    df = cand2
                        except Exception as pe2:
                            last_error = f"YFinance history error (start/end {days}d): {str(pe2)}"
                            continue
            except Exception as e:
                last_error = f"YFinance setup error: {str(e)}"
            finally:
                try:
                    if session:
                        session.close()
                except Exception:
                    pass

        # If all data fetching attempts failed, report the error
        if df is None or df.empty or 'Close' not in df.columns:
            print_json({
                "error": f"ERROR_DATA_FETCH: Failed to fetch data for '{ticker_symbol}'. Last error: {last_error}"
            })
            return None
        
        try:
            # Basic data validation
            if df.empty:
                print_json({
                    "error": f"ERROR_DATA_FETCH: No data available for '{ticker_symbol}'"
                })
                return None

            # Ensure closing price column exists
            if 'Close' not in df.columns:
                print_json({
                    "error": f"ERROR_DATA_FETCH: No closing price data available for '{ticker_symbol}'."
                })
                return None

            # Step 1: Clean raw price data
            df = df[['Close']].copy()  # Extract just Close prices
            df.dropna(inplace=True)    # Remove any NaN prices
            
            # Need extra history for indicator calculation
            if len(df) < 60:  # require at least 60 days for the model input
                print_json({
                    "error": f"ERROR_DATA_FETCH: Insufficient price history for '{ticker_symbol}'. Need at least 60 days, got {len(df)}"
                })
                return None

            # Step 2: Calculate technical indicators
            try:
                # RSI calculation (14-period)
                df['RSI'] = ta.rsi(df['Close'], length=14)
                
                # MACD calculation (12,26,9)
                macd = ta.macd(df['Close'], fast=12, slow=26, signal=9)
                macd_col = next((col for col in macd.columns if col.startswith('MACD_')), macd.columns[0])
                df['MACD'] = macd[macd_col]
                
                # Forward fill a few NaNs that might appear at edges
                df.fillna(method='ffill', inplace=True)
                df.fillna(method='bfill', inplace=True)
            except Exception as e:
                print_json({
                    "error": f"ERROR_DATA_FETCH: Failed to calculate indicators for '{ticker_symbol}': {str(e)}"
                })
                return None

            # Step 3: Final validation
            if df.isnull().any().any():
                # Still have NaNs after forward/backward fill
                df.dropna(inplace=True)

            # Verify sufficient clean data for prediction
            if len(df) < 60:
                print_json({
                    "error": f"ERROR_DATA_FETCH: Insufficient clean data for '{ticker_symbol}' after TI calculation. Need at least 60 days, got {len(df)}"
                })
                return None
                
            # continue to feature extraction
        except Exception as e:
            print_json({
                "error": f"ERROR_DATA_FETCH: Unexpected error processing data for '{ticker_symbol}': {str(e)}"
            })
            return None

        # Take last 60 rows and return as list of [Close, RSI, MACD]
        last60 = df.tail(60)
        features = last60[['Close', 'RSI', 'MACD']].values.tolist()

        # Final validation for infinite or NaN values
        if any(np.isinf(x) or np.isnan(x) for row in features for x in row):
            print_json({
                "error": f"ERROR_DATA_FETCH: Invalid data found for '{ticker_symbol}'. Some values are invalid."
            })
            return None

        return features
        
    except Exception as e:
        print_json({
            "error": f"ERROR_DATA_FETCH: Unexpected error while processing data for '{ticker_symbol}': {str(e)}"
        })
        return None


def main():
    # Ensure clean start
    sys.stdout.flush()
    
    try:
        parser = argparse.ArgumentParser()
        parser.add_argument('--ticker', help='Stock ticker symbol (e.g., AAPL)')
        parser.add_argument('--data', help='JSON array of 60 numbers (optional)')
        parser.add_argument('--min', type=float, required=True, dest='scaler_min')
        parser.add_argument('--max', type=float, required=True, dest='scaler_max')
        parser.add_argument('--model', default=os.path.join(os.path.dirname(__file__), 'model', 'model.keras'))
        args = parser.parse_args()

        # Handle either ticker or direct data input
        if args.ticker:
            data = fetch_stock_data(args.ticker)
            if data is None:
                # Error already printed by fetch_stock_data
                return
        elif args.data:
            try:
                data = json.loads(args.data)
            except Exception:
                print_json({
                    "error": "ERROR_DATA_PARSE: Invalid JSON format for input data."
                })
                return
        else:
            print_json({
                "error": "ERROR_INVALID_INPUT: Either ticker or data must be provided."
            })
            return
    except Exception as e:
        print(json.dumps({
            "error": f"ERROR_RUNTIME: Unexpected error during execution: {str(e)}"
        }))
        return

    if not isinstance(data, (list, np.ndarray)) or len(data) != 60:
        print(json.dumps({
            "error": f"ERROR_DATA_VALIDATION: Input must be a list of 60 numbers, got {len(data) if isinstance(data, (list, np.ndarray)) else type(data)}"
        }))
        return

    try:
        # The input `data` can be either:
        # - A list/array of 60 close prices (1D)
        # - A list/array of 60 feature tuples/lists [close, rsi, macd] (2D)
        features = None

        # Detect multivariate input (list of lists/tuples)
        if isinstance(data, (list, np.ndarray)) and len(data) > 0 and isinstance(data[0], (list, tuple, np.ndarray)):
            arr = np.array(data, dtype=np.float32)
            if arr.ndim != 2 or arr.shape[1] != 3:
                print_json({"error": "ERROR_DATA_VALIDATION: Multivariate input must be shape [60,3]"})
                return
            features = arr
        else:
            # Close-only input: compute RSI and MACD manually using fast numpy operations
            close_prices = np.array(data, dtype=np.float32)
            
            try:
                # Manual RSI calculation (14-period)
                def calculate_rsi(prices, period=14):
                    deltas = np.diff(prices)
                    seed = deltas[:period+1]
                    up = seed[seed >= 0].sum()/period
                    down = -seed[seed < 0].sum()/period
                    rs = up/down if down != 0 else 0
                    rsi = np.zeros_like(prices)
                    rsi[:period] = 50.0  # Default for first values
                    rsi[period] = 100. - 100./(1. + rs)
                    
                    for i in range(period+1, len(prices)):
                        delta = deltas[i-1]
                        if delta > 0:
                            upval = delta
                            downval = 0.
                        else:
                            upval = 0.
                            downval = -delta
                        
                        up = (up*(period-1) + upval)/period
                        down = (down*(period-1) + downval)/period
                        rs = up/down if down != 0 else 0
                        rsi[i] = 100. - 100./(1. + rs)
                    
                    return rsi
                
                # Manual MACD calculation (12, 26, 9)
                def calculate_macd(prices, fast=12, slow=26):
                    # Calculate EMAs
                    ema_fast = pd.Series(prices).ewm(span=fast, adjust=False).mean().values
                    ema_slow = pd.Series(prices).ewm(span=slow, adjust=False).mean().values
                    macd_line = ema_fast - ema_slow
                    return macd_line
                
                # Calculate indicators
                rsi_values = calculate_rsi(close_prices, period=14)
                macd_values = calculate_macd(close_prices, fast=12, slow=26)
                
                # Create features array
                features = np.column_stack([
                    close_prices,
                    rsi_values,
                    macd_values
                ])
                
            except Exception as e:
                print_json({"error": f"ERROR_DATA_VALIDATION: Failed to calculate indicators: {str(e)}"})
                return

            # Ensure we have exactly 60 rows
            if len(features) < 60:
                print_json({"error": "ERROR_DATA_VALIDATION: Need 60 points for manual input after indicator calculation."})
                return
            
            # Take last 60 if we have more
            features = features[-60:]
        
        if any(np.isnan(x) or np.isinf(x) for x in features.flatten()):
            print(json.dumps({
                "error": "ERROR_DATA_VALIDATION: Input contains invalid numbers (NaN or infinity)"
            }))
            return

        scaler_min = float(args.scaler_min)
        scaler_max = float(args.scaler_max)
        range_val = scaler_max - scaler_min

        # Normalize input using fixed MinMax parameters (only normalize Close prices)
        normalized = features.copy()
        normalized[:, 0] = (features[:, 0] - scaler_min) / range_val
        # RSI is already 0-100, normalize to 0-1
        normalized[:, 1] = features[:, 1] / 100.0
        macd_range = max(abs(features[:, 2].min()), abs(features[:, 2].max()))
        if macd_range != 0:
            normalized[:, 2] = features[:, 2] / (2 * macd_range) + 0.5  # Center around 0.5
        
    except ValueError as e:
        print(json.dumps({
            "error": f"ERROR_DATA_VALIDATION: Failed to convert values to float: {str(e)}"
        }))
        return
    except Exception as e:
        print(json.dumps({
            "error": f"ERROR_DATA_VALIDATION: Unexpected error during data validation: {str(e)}"
        }))
        return

    # LSTM expects shape [1, 60, 3] for [Close, RSI, MACD]
    X = normalized.reshape(1, 60, 3)

    # Load Keras model and predict
    model = tf.keras.models.load_model(args.model)
    y = model.predict(X, verbose=0)
    normalized_pred = float(y[0][0])
    predicted = normalized_pred * range_val + scaler_min

    # Extract raw series for frontend visualization from features (shape: [60,3])
    try:
        close_series = features[:, 0].tolist()
        rsi_series = features[:, 1].tolist()
        macd_series = features[:, 2].tolist()
        last_close_val = float(close_series[-1]) if len(close_series) > 0 else None
    except Exception:
        # Fallback to original data when indexing fails
        try:
            last_close_val = float(data[-1][0]) if (isinstance(data[-1], (list, tuple)) and len(data[-1])>0) else (float(data[-1]) if len(data) > 0 else None)
        except Exception:
            last_close_val = None

    print_json({
        'predicted': float(predicted),
        'normalizedPred': float(normalized_pred),
        'timesteps': 60,
        'lastClose': last_close_val,
        'series': {
            'close': close_series,
            'rsi': rsi_series,
            'macd': macd_series
        }
    })


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        # Capture full traceback and print a single structured JSON error
        full_trace = traceback.format_exc()
        message = str(e)
        payload = {
            "error_code": "500_CRITICAL_PYTHON_CRASH",
            "message": message,
            "traceback": full_trace
        }
        # Use print_json to ensure consistent, flushed JSON output
        try:
            print_json(payload)
        except Exception:
            # Fallback to raw print if print_json fails
            print(json.dumps(payload))
        # Exit with non-zero code to signal failure to caller
        sys.exit(1)