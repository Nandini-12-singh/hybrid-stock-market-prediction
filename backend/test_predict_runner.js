const { spawn } = require('child_process');
const path = require('path');

(async function(){
  const pythonExe = path.join(__dirname, '..', 'stock-env', 'Scripts', 'python.exe');
  const scriptPath = path.join(__dirname, 'predict.py');

  const multivariate = Array.from({length:60}, (_,i)=>[100 + i, 50, 0]);

  const args = [
    scriptPath,
    '--data', JSON.stringify(multivariate),
    '--min', '50',
    '--max', '200',
    '--model', path.join(__dirname, 'model', 'nonexistent.keras')
  ];

  const proc = spawn(pythonExe, args, { encoding: 'utf-8' });
  let stdout = '';
  let stderr = '';

  proc.stdout.on('data', (d) => { stdout += d.toString(); });
  proc.stderr.on('data', (d) => { stderr += d.toString(); });

  proc.on('close', (code) => {
    const lines = stdout.split('\n').map(l=>l.trim()).filter(Boolean);
    const last = lines.pop();
    console.log('Exit code:', code);
    if (last) {
      try {
        const parsed = JSON.parse(last);
        console.log('Parsed output:', parsed);
        if (parsed.error_code === '500_CRITICAL_PYTHON_CRASH') {
          console.error('Detected CRITICAL PYTHON CRASH');
          console.error('Message:', parsed.message);
          console.error('Traceback:\n', parsed.traceback);
          process.exit(1);
        }
      } catch (e) {
        console.error('Failed to parse output:', last);
        console.error('STDERR:', stderr);
        process.exit(1);
      }
    } else {
      console.error('No stdout captured. Stderr:\n', stderr);
      process.exit(1);
    }
  });

  proc.on('error', (err) => { console.error('Spawn error:', err); process.exit(2); });
})();
