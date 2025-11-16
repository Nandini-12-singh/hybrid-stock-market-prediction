const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { promisify } = require('util');

let modelReady = false;
const SUBPROCESS_TIMEOUT = 60000; // 60 seconds timeout

// Fixed MinMaxScaler parameters based on training configuration
const SCALER_MIN = 50.694803;
const SCALER_MAX = 199.957651;

async function loadModel() {
  if (modelReady) return true;
  const kerasModelPath = path.join(__dirname, 'model', 'model.keras');
  if (!fs.existsSync(kerasModelPath)) {
    throw new Error(`Keras model not found at ${kerasModelPath}. Please run data_and_train.py to generate it.`);
  }
  modelReady = true;
  return true;
}

function isModelLoaded() {
  return modelReady;
}

async function predictStockPrice(inputData, ticker) {
  try {
    // Input validation
    if (!modelReady) {
      throw new Error('ERROR_MODEL_NOT_READY: Model not loaded. Call loadModel() first.');
    }

    if (inputData) {
      if (!Array.isArray(inputData)) {
        throw new Error('ERROR_INVALID_INPUT: inputData must be an array of numbers.');
      }
      if (inputData.length !== 60) {
        throw new Error('ERROR_INVALID_INPUT: inputData must have exactly 60 elements.');
      }
      if (!inputData.every(num => typeof num === 'number' && !isNaN(num))) {
        throw new Error('ERROR_INVALID_INPUT: All elements must be valid numbers.');
      }
    } else if (!ticker) {
      throw new Error('ERROR_INVALID_INPUT: Either inputData or ticker must be provided.');
    }

    // Prepare Python process execution
    const pythonExe = path.join(__dirname, '..', 'stock-env', 'Scripts', 'python.exe');
    const scriptPath = path.join(__dirname, 'predict.py');
    
    if (!fs.existsSync(pythonExe)) {
      throw new Error('ERROR_ENVIRONMENT: Python executable not found.');
    }
    if (!fs.existsSync(scriptPath)) {
      throw new Error('ERROR_ENVIRONMENT: Prediction script not found.');
    }

    const args = [
      scriptPath,
      '--model', path.join(__dirname, 'model', 'model.keras'),
      '--min', String(SCALER_MIN),
      '--max', String(SCALER_MAX),
    ];

    if (ticker) {
      args.push('--ticker', ticker);
    } else {
      args.push('--data', JSON.stringify(inputData));
    }

    // Execute Python script with proper error handling and timeout
    const result = await new Promise((resolve, reject) => {
      let stdoutData = '';
      let stderrData = '';
      const startTime = Date.now();
      const timeoutId = setTimeout(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.error(`Python script timeout after ${elapsed}s`);
        pythonProcess.kill();
        reject(new Error(`ERROR_TIMEOUT: Python script execution timed out after ${elapsed} seconds`));
      }, SUBPROCESS_TIMEOUT);

      const pythonProcess = spawn(pythonExe, args, { encoding: 'utf-8' });
      console.log(`Python process started with PID: ${pythonProcess.pid}`);

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code === 0) {
          resolve({ stdout: stdoutData, stderr: stderrData });
        } else {
          reject(new Error(`ERROR_PYTHON_FAILURE: Process exited with code ${code}\n${stderrData}`));
        }
      });

      pythonProcess.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(new Error(`ERROR_PROCESS_SPAWN: Failed to start Python process: ${err.message}`));
      });
    });

    // Process and validate the output
    const cleanOutput = result.stdout
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .pop();

    if (!cleanOutput) {
      throw new Error('ERROR_EMPTY_OUTPUT: No valid output received from Python script');
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanOutput);
    } catch (e) {
      throw new Error(`ERROR_PARSE_FAILURE: Failed to parse Python output: ${e.message}\nRaw output: ${cleanOutput}`);
    }

    // Validate response structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('ERROR_INVALID_RESPONSE: Invalid response format');
    }

    if (parsed.error) {
      // New structured critical Python crash reporting
      if (parsed.error_code === '500_CRITICAL_PYTHON_CRASH') {
        const err = new Error(`500_CRITICAL_PYTHON_CRASH: ${parsed.message || 'Python process crashed.'}`);
        // Attach traceback and raw message for upstream handlers
        err.pythonTraceback = parsed.traceback || null;
        err.pythonMessage = parsed.message || null;
        throw err;
      }

      // Backwards-compatibility: older scripts might use error/ details
      if (parsed.error === '500_PYTHON_CRASH' && parsed.details) {
        const err = new Error(`500_PYTHON_CRASH: ${parsed.details}`);
        err.pythonDetails = parsed.details;
        throw err;
      }

      if (typeof parsed.error === 'string' && parsed.error.startsWith('ERROR_')) {
        throw new Error(parsed.error);
      }
      throw new Error(`ERROR_PREDICTION: ${typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error)}`);
    }

    if (typeof parsed.predicted !== 'number' || isNaN(parsed.predicted)) {
      throw new Error('ERROR_INVALID_RESPONSE: Prediction value is missing or invalid');
    }

    return parsed;
  } catch (error) {
    // Ensure all errors are properly formatted
    if (!error.message.startsWith('ERROR_')) {
      error.message = `ERROR_UNEXPECTED: ${error.message}`;
    }
    throw error;
  }
}

module.exports = { loadModel, isModelLoaded, predictStockPrice, SCALER_MIN, SCALER_MAX };