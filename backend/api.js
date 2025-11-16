const express = require('express');
const { loadModel, predictStockPrice } = require('./model');

const router = express.Router();

// POST /api/predict
// Body: { data: number[] } where data is historical price series
router.post('/api/predict', async (req, res) => {
  try {
    const { data, ticker } = req.body || {};
    
    // Ensure model is loaded (will throw with clear error if missing)
    await loadModel();

    let result;
    if (ticker) {
      result = await predictStockPrice(null, ticker);
    } else if (Array.isArray(data) && data.length > 0) {
      result = await predictStockPrice(data);
    } else {
      return res.status(400).json({ 
        error: 'ERROR_INVALID_INPUT: Body must include either ticker symbol or non-empty array of historical prices.' 
      });
    }
    return res.json({ 
      prediction: result.predicted, 
      meta: { 
        normalizedPred: result.normalizedPred, 
        timesteps: result.timesteps,
        lastClose: result.lastClose
      },
      // Forward raw series when available for frontend visualization
      series: (result.series ? {
        close: result.series.close || null,
        rsi: result.series.rsi || null,
        macd: result.series.macd || null,
      } : null)
    });
  } catch (err) {
    // Parse the error message to determine the appropriate status code
    const errorMessage = err.message || 'Prediction failed.';
    let statusCode = 500;

    // If the model layer attached a python traceback, surface it as a 500 with details
    if (err && err.pythonTraceback) {
      return res.status(500).json({
        error: err.pythonMessage || 'Critical Python crash',
        traceback: err.pythonTraceback,
        code: '500_CRITICAL_PYTHON_CRASH'
      });
    }

    if (errorMessage.startsWith('ERROR_DATA_FETCH:') || 
        errorMessage.startsWith('ERROR_INVALID_INPUT:') ||
        errorMessage.startsWith('ERROR_DATA_PARSE:')) {
      statusCode = 400; // Bad Request
    } else if (errorMessage.startsWith('ERROR_PYTHON_FAILURE:')) {
      statusCode = 500; // Internal Server Error
    }

    // Remove the error code prefix for client display
    const clientMessage = errorMessage.includes(':') ? 
      errorMessage.split(':')[1].trim() : 
      errorMessage;

    return res.status(statusCode).json({ 
      error: clientMessage,
      code: errorMessage.split(':')[0]
    });
  }
});

module.exports = router;