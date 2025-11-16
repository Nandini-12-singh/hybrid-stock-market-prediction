import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_mock_prices(start_price, end_price, days=65):
    """Generate smooth mock price data with some realistic variation"""
    # Create base trend
    prices = np.linspace(start_price, end_price, days)
    
    # Add some random variation (1% standard deviation)
    noise = np.random.normal(0, 0.01, days)
    prices = prices * (1 + noise)
    
    # Ensure prices stay within reasonable bounds
    prices = np.clip(prices, start_price * 0.95, end_price * 1.05)
    
    return prices

def fetch_data_from_sheet(ticker):
    """
    Mock function to fetch data from Google Sheets.
    Returns a DataFrame with mock data for AAPL and MSFT.
    """
    ticker = ticker.upper()
    
    # Generate dates for the last 65 days
    end_date = datetime.now()
    dates = [(end_date - timedelta(days=x)).strftime('%Y-%m-%d') 
             for x in range(65)]
    dates.reverse()  # Make dates ascending
    
    if ticker == 'AAPL':
        # Mock AAPL data: Trending from $150 to $170
        prices = generate_mock_prices(150.0, 170.0)
    elif ticker == 'MSFT':
        # Mock MSFT data: Trending from $310 to $330
        prices = generate_mock_prices(310.0, 330.0)
    else:
        # For any other ticker, raise an error
        raise ValueError(f"Mock data not available for ticker: {ticker}")
    
    # Create DataFrame with the mock data
    df = pd.DataFrame({
        'Date': dates,
        'Close': prices
    })
    df.set_index('Date', inplace=True)
    
    return df

def is_supported_ticker(ticker):
    """Check if a ticker is supported by our mock data"""
    return ticker.upper() in ['AAPL', 'MSFT']