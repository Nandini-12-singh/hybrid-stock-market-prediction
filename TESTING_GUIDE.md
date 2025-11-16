# 🧪 Model Simulation Testing Guide

## 📋 Overview

This guide explains how to test the stock prediction model simulation with both **ticker symbols** and **manual price data**.

## 🏗️ Backend Architecture

### Components:
1. **Node.js Server** (`backend/index.js`) - Port 3001
2. **API Routes** (`backend/api.js`) - Handles `/api/predict`
3. **Python Model** (`backend/predict.py`) - LSTM model execution
4. **Model File** (`backend/model/model.keras`) - Trained Keras model

### Input Requirements:
- **Scaler Range**: Min $50.69, Max $199.95
- **Data Points**: 60 historical prices required
- **Features**: [Close Price, RSI, MACD] (multivariate)
- **Model Architecture**: LSTM with 60 timesteps, 3 features

## 🚀 Starting the Backend Server

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies (if needed)
```bash
npm install
```

### Step 3: Start the Server
```bash
node index.js
```

**Expected Output:**
```
Backend server listening at http://localhost:3001
Note: If your Next.js dev server is also on 3000, stop it before running this backend.
```

## 🧪 Testing Methods

### Method 1: Testing with Ticker Symbol (Recommended)

#### Best Tickers to Test:
```
✅ AAPL  - Apple Inc. (High volume, stable)
✅ MSFT  - Microsoft (Tech sector)
✅ GOOGL - Alphabet/Google (Tech)
✅ TSLA  - Tesla (Volatile, interesting)
✅ AMZN  - Amazon (E-commerce)
```

#### Steps:
1. Go to http://localhost:3000/simulation
2. Toggle to **"Ticker Mode"**
3. Enter ticker: `AAPL`
4. Click **"Run Prediction Simulation"**

#### What Happens:
- Backend fetches last 60 days of data from yfinance
- Calculates RSI (14-period) and MACD (12,26,9)
- Normalizes data using scaler range
- Runs LSTM prediction
- Returns predicted price + visualization data

---

### Method 2: Testing with Manual CSV Data

#### Sample Data (60 prices):
```
150.23,151.45,152.67,151.89,153.12,154.34,153.56,155.78,156.90,155.12,157.34,158.56,157.78,159.01,160.23,159.45,161.67,162.89,161.11,163.34,164.56,163.78,165.90,167.12,166.34,168.56,169.78,168.90,170.12,171.34,170.56,172.78,174.00,173.22,175.44,176.66,175.88,177.10,178.32,177.54,179.76,180.98,180.20,182.42,183.64,182.86,185.08,186.30,185.52,187.74,188.96,188.18,190.40,191.62,190.84,193.06,194.28,193.50,195.72,196.94
```

#### Steps:
1. Go to http://localhost:3000/simulation
2. Stay in **"Manual Mode"**
3. Paste the 60 comma-separated prices
4. Click **"Run Prediction Simulation"**

#### What Happens:
- Backend receives array of 60 prices
- Calculates RSI and MACD from prices
- Normalizes data
- Runs prediction
- Returns result

---

## 📊 Expected API Response

### Success Response:
```json
{
  "prediction": 198.45,
  "meta": {
    "normalizedPred": 0.7234,
    "timesteps": 60,
    "lastClose": 196.94
  },
  "series": {
    "close": [150.23, 151.45, ...],
    "rsi": [45.23, 48.67, ...],
    "macd": [0.45, 0.67, ...]
  }
}
```

### Error Response:
```json
{
  "error": "Insufficient price history for 'XYZ'. Need at least 60 days, got 30",
  "code": "ERROR_DATA_FETCH"
}
```

---

## 🧪 Test Cases

### ✅ Test Case 1: Valid Ticker
**Input:** `AAPL`  
**Expected:** Prediction between $160-$200  
**Result:** ✓ Success

### ✅ Test Case 2: Invalid Ticker
**Input:** `INVALIDXYZ`  
**Expected:** Error message  
**Result:** ✓ Error handled

### ✅ Test Case 3: Manual Data (60 points)
**Input:** 60 comma-separated prices  
**Expected:** Prediction with calculated indicators  
**Result:** ✓ Success

### ❌ Test Case 4: Insufficient Data
**Input:** Only 30 prices  
**Expected:** Error "Need at least 60 days"  
**Result:** ✓ Error handled

### ✅ Test Case 5: CSV File Upload
**Action:** Drag & drop CSV with 'Close' column  
**Expected:** Auto-extract 60 prices  
**Result:** ✓ Success

---

## 🔍 Understanding the Results

### Prediction Display:
- **Large Number**: Predicted stock price for next day
- **Chart**: Historical prices (blue) + predicted point (green)
- **Toggle Views**: Price chart vs MACD chart

### Metrics (when available):
- **RMSE**: Root Mean Square Error
- **MAE**: Mean Absolute Error  
- **Directional Accuracy**: % correct trend prediction

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch"
**Cause:** Backend not running  
**Fix:** Start backend with `node index.js`

### Issue 2: "Connection refused"
**Cause:** Wrong port or backend crashed  
**Fix:** Check backend console, restart if needed

### Issue 3: "Need at least 60 days"
**Cause:** Insufficient historical data for ticker  
**Fix:** Try a different, more active ticker (AAPL, MSFT)

### Issue 4: "Invalid ticker symbol"
**Cause:** Ticker doesn't exist or is delisted  
**Fix:** Use valid, actively traded ticker

### Issue 5: Model file not found
**Cause:** `backend/model/model.keras` missing  
**Fix:** Ensure model file exists in correct location

---

## 📈 Best Practices for Testing

### 1. **Start with Known Tickers**
   - Use AAPL, MSFT, GOOGL for reliable results
   - These have consistent data availability

### 2. **Validate Manual Input**
   - Ensure exactly 60 comma-separated numbers
   - No spaces, just commas
   - Numbers should be realistic stock prices ($50-$200)

### 3. **Check Price Range**
   - Model trained on prices $50.69 - $199.95
   - Input outside this range may give poor predictions

### 4. **Monitor Backend Logs**
   - Watch terminal for errors
   - Python errors will show detailed traceback

### 5. **Use Loader Animation**
   - Wait for gradient loader to complete
   - Prediction takes 2-5 seconds typically

---

## 🎯 Quick Test Commands

### Test Backend Health:
```bash
curl http://localhost:3001
```
**Expected:** `{"status":"ok","service":"stock-prediction-backend"}`

### Test Prediction with CURL:
```bash
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL"}'
```

### Test with Manual Data:
```bash
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"data":[150.23,151.45,152.67,...]}'
```

---

## 📊 Sample Test Data Sets

### Dataset 1: Upward Trend (Good for Testing)
```
120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179
```

### Dataset 2: Volatile (Realistic Market)
```
155.50,157.20,154.80,158.40,156.90,160.30,158.70,162.10,159.80,163.50,161.40,165.20,162.90,166.80,164.30,168.40,165.70,170.10,167.50,171.90,169.20,173.60,170.80,175.30,172.40,177.10,174.20,178.90,175.80,180.50,177.30,182.20,179.10,183.90,180.70,185.60,182.40,187.30,184.10,189.00,185.80,190.70,187.50,192.40,189.20,194.10,190.90,195.80,192.60,197.50,194.30,199.20
```

### Dataset 3: Downward Trend
```
180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121
```

---

## ✨ Expected Behavior

### When Testing Works Correctly:
1. ✅ Loader animation appears immediately
2. ✅ Backend processes request (2-5 seconds)
3. ✅ Prediction displays in large font
4. ✅ Charts populate with historical + predicted data
5. ✅ Metrics show RMSE, MAE, accuracy
6. ✅ No console errors in browser or backend

### Visual Indicators:
- **Cyan glow** on prediction box
- **Glass effect** on all cards
- **Smooth animations** during reveal
- **Chart with gradient** for predicted point

---

## 🎓 Understanding the Model

### Model Type: LSTM (Long Short-Term Memory)
- **Input Shape**: [1, 60, 3]
  - Batch: 1 sample
  - Timesteps: 60 days
  - Features: 3 (Close, RSI, MACD)

### Features:
1. **Close Price**: Raw closing price
2. **RSI**: Relative Strength Index (0-100)
3. **MACD**: Moving Average Convergence Divergence

### Training Range:
- **Min**: $50.69
- **Max**: $199.95
- Model performs best within this range

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch data" | Backend down | Start `node index.js` |
| "Need at least 60 days" | Insufficient history | Use different ticker |
| "Invalid ticker symbol" | Non-existent ticker | Use AAPL, MSFT, GOOGL |
| "Invalid JSON format" | Bad manual input | Check comma separation |
| "Model not found" | Missing .keras file | Ensure model file exists |

---

## ✅ Testing Checklist

- [ ] Backend server running on port 3001
- [ ] Frontend accessible at localhost:3000/simulation
- [ ] Test with AAPL ticker (should work)
- [ ] Test with invalid ticker (should show error)
- [ ] Test with 60 manual prices (should work)
- [ ] Test with <60 prices (should show error)
- [ ] Check loader animation appears
- [ ] Verify prediction displays correctly
- [ ] Confirm charts populate
- [ ] Check console for any errors

---

## 🎉 Success Criteria

Your model simulation is working correctly if:
1. ✅ Backend starts without errors
2. ✅ AAPL prediction returns ~$160-$200
3. ✅ Charts display historical data
4. ✅ Loader shows during processing
5. ✅ Error messages are clear and helpful
6. ✅ UI is responsive and smooth

---

**Happy Testing! 🚀**
