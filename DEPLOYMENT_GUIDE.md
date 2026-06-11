# Ujima Loan Pride - Complete Setup & Deployment Guide

## 🚀 Quick Start (3 Steps)

### For Assessors - Ready to Run

**Windows:**
```powershell
cd c:\Users\IANNERET\OneDrive\Desktop\live\ prototype
.\start.ps1
```

**Mac/Linux:**
```bash
cd ~/Desktop/live\ prototype
bash start.sh
```

Then open: **http://localhost:5173**

Demo page: **http://localhost:5173/demo**

---

## 📋 System Requirements

- **Python** 3.10+ (required for CrewAI)
- **Node.js** 16+ (for React/Vite)
- **npm** 8+ (for package management)
- **Google Gemini API Key** (for loan assessment)
- **Internet connection** (for Gemini API calls)

### Check Your Installation

```bash
python --version
node --version
npm --version
```

---

## 🔧 Manual Setup (If Startup Script Fails)

### 1. Setup Python API Server

```bash
cd ujima-loan-pride

# Create virtual environment (first time only)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start API server
python api.py
```

**Expected Output:**
```
80 - Ujima Loan Pride API Server Starting
...
 * Running on http://0.0.0.0:5000
 * Press CTRL+C to quit
```

### 2. Setup React Frontend (New Terminal)

```bash
cd ujima-landing

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v4.4.5  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## 🌐 Accessing the Application

Once both servers are running:

1. **Landing Page:** http://localhost:5173
2. **Assessment Demo:** http://localhost:5173/demo
3. **API Health:** http://localhost:5000/health

---

## 🔑 Setting Up Google Gemini API Key

### Option 1: Environment Variable (Recommended)

1. Create `.env` in `ujima-loan-pride/`:
```
GEMINI_API_KEY=your-api-key-here
```

2. The API will automatically use this key

### Option 2: Provide in Demo

1. Go to http://localhost:5173/demo
2. Enter your API key in the form
3. Click "Run Assessment"

### How to Get a Gemini API Key

1. Go to: https://ai.google.dev
2. Click "Get API Key"
3. Follow the setup instructions
4. Copy your API key
5. Enable "Generative Language API" in Google Cloud Console

---

## 🏗️ Project Architecture

```
live prototype/
├── ujima-loan-pride/          # Python Backend
│   ├── api.py                 # Flask REST API
│   ├── main.py               # CLI entrypoint
│   ├── crew.py               # CrewAI orchestration
│   ├── agents.py             # AI agents (Scout, Guardian, Hunter)
│   ├── tasks.py              # Agent tasks
│   ├── profiles.py           # Sample loan profiles
│   ├── requirements.txt       # Python dependencies
│   └── .env                  # API keys
│
├── ujima-landing/             # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── AssessmentDemo.jsx  # <-- Main integration
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
└── start.ps1                  # Windows startup script
```

---

## 📡 API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-03T14:30:00",
  "service": "Ujima Loan Pride API"
}
```

### GET /api/config
Get available profiles and configuration.

**Response:**
```json
{
  "status": "success",
  "profiles": [
    {
      "id": 0,
      "name": "Jane Kipchoge",
      "occupation": "Farmer",
      "loan_amount_kes": 50000
    },
    ...
  ]
}
```

### POST /api/assess
Run assessment on all profiles.

**Request:**
```json
{
  "api_key": "your-optional-api-key"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Loan assessments completed",
  "results": [
    {
      "member_profile": {...},
      "decision": "APPROVED",
      "scout_json": {...},
      "guardian_json": {...},
      "hunter_output": "..."
    },
    ...
  ],
  "summary": {
    "total_processed": 3,
    "timestamp": "2026-06-03T14:30:00"
  }
}
```

### POST /api/assess/{profile_id}
Run assessment on a single profile.

**Request:**
```json
{
  "api_key": "your-optional-api-key"
}
```

**Response:** Same as `/api/assess` but for single profile

---

## 🐛 Troubleshooting

### Issue: API Server Won't Start

**Problem:** `Address already in use` or port 5000 is blocked

**Solutions:**
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

### Issue: "Cannot find module" or Import Errors

**Problem:** Dependencies not installed properly

**Solutions:**
```bash
# Reinstall Python dependencies
cd ujima-loan-pride
pip install --upgrade -r requirements.txt

# Reinstall Node dependencies
cd ujima-landing
rm -rf node_modules package-lock.json
npm install
```

### Issue: API Key Invalid Error

**Problem:** Google Gemini API key doesn't work

**Solutions:**
1. Verify the key in `.env` file (no quotes)
2. Ensure Generative Language API is enabled
3. Check Google Cloud quota limits
4. Try a new API key

### Issue: CORS Errors in Browser Console

**Problem:** React can't reach API

**Solutions:**
- Make sure Python API is running on port 5000
- Check http://localhost:5000/health
- Try providing the full API key in the demo form

---

## 📊 Features

### Landing Page
- Modern fintech design
- Smooth animations
- Responsive mobile design
- Feature showcase
- Testimonials
- Impact statistics

### Assessment Demo Page
- Live loan assessment interface
- API key input (optional)
- Real-time results display
- JSON export
- Error handling
- Loading states

### Python Backend
- Three AI agents (Scout, Guardian, Hunter)
- Multi-agent crew orchestration
- Gemini API integration
- JSON response parsing
- Comprehensive logging
- Production-ready error handling

---

## 🚀 Production Deployment

### For Hosting (Coming Soon)

1. **Backend:** Deploy to Railway, Heroku, or AWS
   - Requires Python 3.10+ runtime
   - Set `GEMINI_API_KEY` as environment variable
   - Expose port 5000

2. **Frontend:** Deploy to Vercel, Netlify, or GitHub Pages
   - Set `VITE_API_URL` environment variable
   - Point to backend API URL

Example with Vercel:
```
VITE_API_URL=https://your-api.railway.app
```

---

## 📝 Logs & Debugging

### API Logs
Located in `ujima-loan-pride/api.log`

```bash
tail -f ujima-loan-pride/api.log
```

### Browser Logs
Open DevTools (F12 → Console tab)

### Enable Verbose Logging
```bash
FLASK_ENV=development python api.py
```

---

## ✅ Pre-Assessment Checklist

- [ ] Python 3.10+ installed
- [ ] Node.js 16+ installed
- [ ] Google Gemini API key created
- [ ] `.env` file in `ujima-loan-pride/` with `GEMINI_API_KEY`
- [ ] Ran `pip install -r requirements.txt` successfully
- [ ] Ran `npm install` in `ujima-landing/` successfully
- [ ] Both servers starting without errors
- [ ] http://localhost:5173 loads successfully
- [ ] http://localhost:5173/demo loads successfully
- [ ] API health check passes: http://localhost:5000/health

---

## 📞 Support

If assessors encounter issues:

1. **Check the startup script output** for error messages
2. **Verify all dependencies** are installed
3. **Check the API logs** at `ujima-loan-pride/api.log`
4. **Check browser console** for frontend errors
5. **Restart both servers** (kill and rerun)

---

## 🎯 What Assessors Will See

1. **Landing Page** - Professional fintech design showcasing Ujima
2. **Demo Page** - Live assessment interface to test the AI system
3. **Results** - Detailed loan assessment output from three AI agents
4. **Error Handling** - Clear messages if anything goes wrong

---

**Built with ❤️ for fair lending in Kenya**

© 2026 Ujima Loan Pride. All Rights Reserved.
