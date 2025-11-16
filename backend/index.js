const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./api');

const app = express();
const port = 3001; // Avoid conflict with Next.js dev server on 3000

app.use(cors());
app.use(bodyParser.json());

// Health check / root
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'stock-prediction-backend' });
});

// Mount API routes (includes /api/predict)
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  console.log('Note: If your Next.js dev server is also on 3000, stop it before running this backend.');
});