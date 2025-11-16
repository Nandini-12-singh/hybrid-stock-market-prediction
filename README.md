# 🚀 Stock Market Prediction System

AI-powered stock price prediction using LSTM neural networks with modern UI/UX.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?style=flat-square&logo=tensorflow)
![Python](https://img.shields.io/badge/Python-3.9+-green?style=flat-square&logo=python)

## ✨ Features

- 🎯 **Real-time Predictions**: Get next-day stock price predictions using LSTM neural networks
- 📊 **Multiple Input Methods**: Use ticker symbols (AAPL, MSFT, etc.) or manual CSV data
- 📈 **Interactive Charts**: Beautiful visualizations with Price and RSI indicators
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- ⚡ **Fast Processing**: Optimized backend for quick predictions (2-5 seconds)
- 🔄 **Live Data**: Fetches real stock data from Yahoo Finance
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Components**: Shadcn/ui

### Backend
- **Runtime**: Node.js with Express
- **ML Framework**: TensorFlow/Keras (Python)
- **Data Source**: Yahoo Finance (yfinance)
- **Technical Indicators**: pandas_ta (RSI, MACD)

## 📊 Model Details

- **Architecture**: LSTM (Long Short-Term Memory)
- **Accuracy**: 82% directional accuracy
- **Features**: 
  - Close Price
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
- **Input**: 60 timesteps (60 days of data)
- **Output**: Next-day price prediction
- **Training Range**: $50.69 - $199.95

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/stock-market-prediction.git
   cd stock-market-prediction
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Set up Python environment:**
   ```bash
   # Create virtual environment
   python -m venv stock-env
   
   # Activate (Windows)
   stock-env\Scripts\activate
   
   # Activate (Mac/Linux)
   source stock-env/bin/activate
   
   # Install Python packages
   pip install tensorflow pandas numpy yfinance pandas_ta
   ```

5. **Start the servers:**

   **Terminal 1 - Frontend:**
   ```bash
   npm run dev
   ```
   
   **Terminal 2 - Backend:**
   ```bash
   cd backend
   node index.js
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📖 Usage

### Method 1: Ticker Symbol Prediction

1. Navigate to the Simulation page
2. Toggle to **"Ticker Mode"**
3. Enter a stock symbol (e.g., `AAPL`, `MSFT`, `GOOGL`)
4. Click **"Run Prediction Simulation"**
5. View prediction and charts

### Method 2: Manual Data Input

1. Navigate to the Simulation page
2. Stay in **"Manual Mode"**
3. Paste 60 comma-separated price values
4. Click **"Run Prediction Simulation"**
5. View prediction and charts

### Recommended Ticker Symbols

**Most Reliable:**
- `AAPL` - Apple
- `MSFT` - Microsoft
- `GOOGL` - Google
- `AMZN` - Amazon
- `TSLA` - Tesla (volatile)
- `JPM` - JPMorgan
- `KO` - Coca-Cola

See [TICKER_SYMBOLS_GUIDE.md](TICKER_SYMBOLS_GUIDE.md) for 50+ more symbols.

## 📚 Documentation

- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive guide to test the model
- **[Ticker Symbols Guide](TICKER_SYMBOLS_GUIDE.md)** - 50+ ticker symbols organized by sector
- **[GitHub Upload Guide](GITHUB_UPLOAD_GUIDE.md)** - How to upload this project to GitHub

## 🎯 Project Structure

```
stock-market-prediction/
├── app/                          # Next.js pages
│   ├── page.tsx                 # Homepage
│   ├── simulation/              # Simulation page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── animations/              # Animation components
│   ├── effects/                 # Visual effects
│   ├── layout/                  # Layout components
│   └── ui/                      # UI components
├── backend/                      # Backend server
│   ├── index.js                 # Express server
│   ├── api.js                   # API routes
│   ├── model.js                 # Model loader
│   ├── predict.py               # Python prediction script
│   └── model/                   # ML model files
├── public/                       # Static assets
├── TESTING_GUIDE.md             # Testing documentation
├── TICKER_SYMBOLS_GUIDE.md      # Ticker symbols reference
└── README.md                    # This file
```

## 🔧 API Endpoints

### POST `/api/predict`

**Request Body (Ticker):**
```json
{
  "ticker": "AAPL"
}
```

**Request Body (Manual Data):**
```json
{
  "data": [120, 121, 122, ..., 179]
}
```

**Response:**
```json
{
  "prediction": 182.05,
  "meta": {
    "normalizedPred": 0.88,
    "timesteps": 60,
    "lastClose": 179
  },
  "series": {
    "close": [120, 121, ...],
    "rsi": [45.2, 48.7, ...],
    "macd": [0.45, 0.67, ...]
  }
}
```

## 🎨 Features Showcase

### Modern Glassmorphism UI
- Frosted glass effects
- Smooth gradient animations
- Cursor-following glow effect
- Parallax scrolling

### Interactive Charts
- Historical price visualization
- RSI momentum indicator
- Overbought/Oversold zones
- Predicted price point highlighting

### Smart Predictions
- Fast RSI/MACD calculation
- Min-Max normalization
- LSTM neural network inference
- Realistic 82% accuracy

## 🚨 Troubleshooting

### Frontend won't start
```bash
# Clear Next.js cache
rm -rf .next
npm install
npm run dev
```

### Backend timeout errors
- Ensure Python virtual environment is activated
- Check all Python packages are installed
- Verify model file exists in `backend/model/`

### Prediction fails
- Use ticker symbols in uppercase (e.g., `AAPL` not `aapl`)
- Ensure exactly 60 values for manual input
- Stick to stocks in $50-$200 range for best accuracy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- **TensorFlow Team** - For the amazing ML framework
- **Shadcn** - For beautiful UI components
- **Yahoo Finance** - For stock market data
- **Vercel** - For Next.js framework
- **Recharts** - For interactive charts

## 📞 Contact

- GitHub: [@YourUsername](https://github.com/YourUsername)
- Email: your.email@example.com
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## ⭐ Star This Repo

If you found this project helpful, please give it a star! It helps others discover it too.

---

**Built with Next.js, TensorFlow, and lots of ☕**
