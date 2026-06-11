# Ujima Loan Pride - Full Stack Application

A modern, production-ready AI-powered SACCO loan assessment platform for Kenya. This application combines a beautiful React landing page with a powerful Python backend using three specialized AI agents (Scout, Guardian, Hunter) coordinated by CrewAI and powered by Google Gemini.

## 🎯 Quick Start (For Assessors)

### Windows
```powershell
.\start.ps1
```

### Mac/Linux
```bash
bash start.sh
```

Then open: **http://localhost:5173**

Demo: **http://localhost:5173/demo**

---

## 📁 Project Structure

```
live prototype/
├── ujima-loan-pride/              # 🐍 Python Backend (Flask API)
│   ├── api.py                     # REST API server
│   ├── main.py                    # CLI entrypoint
│   ├── crew.py                    # CrewAI orchestration
│   ├── agents.py                  # AI agent definitions
│   ├── tasks.py                   # Agent tasks
│   ├── profiles.py                # Sample loan profiles
│   ├── requirements.txt            # Python dependencies
│   ├── .env                       # API keys (not in repo)
│   ├── .env.example               # Template for .env
│   └── api.log                    # API logs
│
├── ujima-landing/                 # ⚛️ React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation with demo link
│   │   │   ├── Hero.jsx           # Hero section
│   │   │   ├── Trust.jsx          # Statistics section
│   │   │   ├── HowItWorks.jsx     # Agent workflow
│   │   │   ├── Features.jsx       # Features showcase
│   │   │   ├── Benefits.jsx       # Member/Officer benefits
│   │   │   ├── Testimonials.jsx   # User stories
│   │   │   ├── Impact.jsx         # Kenya-wide impact
│   │   │   ├── CTA.jsx            # Call to action
│   │   │   ├── Footer.jsx         # Footer
│   │   │   └── AssessmentDemo.jsx # 🔥 Live demo component
│   │   ├── App.jsx                # Router setup
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── start.ps1                      # Windows startup script
├── start.sh                       # Mac/Linux startup script
├── DEPLOYMENT_GUIDE.md            # Complete setup guide
└── README.md                      # This file
```

---

## 🏗️ Architecture

### Frontend (React + Vite)
- **Port:** 5173
- **Technology:** React 18, Vite, Tailwind CSS, Framer Motion
- **Components:** 10 premium sections with smooth animations
- **Demo Page:** Live assessment interface connected to Flask API
- **Routing:** React Router for navigation

### Backend (Flask API)
- **Port:** 5000
- **Technology:** Flask, Flask-CORS, CrewAI, Google Gemini
- **Endpoints:** 
  - `GET /health` - Health check
  - `GET /api/config` - Get available profiles
  - `POST /api/assess` - Assess all loan applications
  - `POST /api/assess/{id}` - Assess single application
- **Features:**
  - Comprehensive error handling
  - Request/response logging
  - CORS support for frontend
  - JSON response formatting
  - Production-ready setup

### AI System (CrewAI + Gemini)
Three specialized AI agents working together:

1. **Scout Agent** 🧭
   - Analyzes income patterns
   - Evaluates financial literacy
   - Builds comprehensive member profiles

2. **Guardian Agent** 🛡️
   - Applies fair lending rules
   - Prevents bias against informal workers
   - Makes loan decisions with scores

3. **Hunter Agent** 🎯
   - Prepares human review briefs
   - Supports complex decision cases
   - Provides actionable recommendations

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- npm 8 or higher
- Google Gemini API Key

### Step 1: Clone/Navigate to Project

```bash
cd Desktop/live\ prototype
```

### Step 2: Setup Python Backend

```bash
cd ujima-loan-pride

# Create virtual environment (first time)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo GEMINI_API_KEY=your-api-key-here > .env

# Start API
python api.py
```

**Expected Output:**
```
80 - Ujima Loan Pride API Server Starting
✓ API Server ready on http://0.0.0.0:5000
```

### Step 3: Setup React Frontend (New Terminal)

```bash
cd ujima-landing

# Install dependencies (first time)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v4.4.5  ready in 123 ms
➜ Local: http://localhost:5173/
```

### Step 4: Access Application

1. **Landing Page:** http://localhost:5173
2. **Assessment Demo:** http://localhost:5173/demo
3. **API Health:** http://localhost:5000/health

---

## 🎨 Features

### Landing Page
- ✨ Modern fintech design with glassmorphism
- 🎬 Smooth animations (Framer Motion)
- 📱 Mobile-first responsive design
- 🦁 African-inspired branding (Green & Gold)
- 📊 Animated statistics counters
- 💬 Real testimonials from Kenya
- 🗺️ Kenya-wide impact showcase

### Assessment Demo Page
- 🔑 API key input (optional)
- ⚡ Real-time loan assessment
- 📋 Detailed results display
  - Scout agent analysis
  - Guardian decision with scores
  - Hunter briefing packets
- 📋 JSON export functionality
- ⚠️ Comprehensive error handling
- ⏳ Loading indicators

### Python Backend
- 🤖 Three AI agents (Scout, Guardian, Hunter)
- 🔄 Multi-agent coordination with CrewAI
- 🔑 Google Gemini API integration
- 📝 Comprehensive request/response logging
- 🛡️ Error handling and validation
- 🚀 Production-ready deployment

---

## 📡 API Documentation

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-03T14:30:00",
  "service": "Ujima Loan Pride API"
}
```

### Get Configuration
```bash
GET /api/config
```

Response:
```json
{
  "status": "success",
  "profiles": [
    {
      "id": 0,
      "name": "Jane Kipchoge",
      "occupation": "Farmer",
      "loan_amount_kes": 50000
    }
  ]
}
```

### Run Assessment
```bash
POST /api/assess
Content-Type: application/json

{
  "api_key": "your-optional-api-key"
}
```

Response:
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
    }
  ]
}
```

### Assess Single Application
```bash
POST /api/assess/0
Content-Type: application/json

{
  "api_key": "your-optional-api-key"
}
```

---

## 🔐 Configuration

### Environment Variables

Create `.env` in `ujima-loan-pride/`:

```env
# Required
GEMINI_API_KEY=your-google-gemini-api-key

# Optional
FLASK_ENV=development
FLASK_DEBUG=1
API_HOST=0.0.0.0
API_PORT=5000
```

### Getting a Gemini API Key

1. Visit: https://ai.google.dev
2. Click "Get API Key"
3. Create a new project in Google Cloud
4. Enable "Generative Language API"
5. Copy your API key
6. Add to `.env` file

---

## 🐛 Troubleshooting

### API Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Dependencies Issue
```bash
# Reinstall Python dependencies
pip install --upgrade -r requirements.txt

# Reinstall Node dependencies
cd ujima-landing
rm -rf node_modules
npm install
```

### API Key Error
- Verify key is in `.env` file without quotes
- Ensure Generative Language API is enabled
- Check Google Cloud quota limits
- Try a fresh API key

### CORS Error in Browser
- Make sure API is running on port 5000
- Check http://localhost:5000/health
- Provide API key in demo form

---

## 📊 Production Build

### Frontend
```bash
cd ujima-landing
npm run build
npm run preview
```

Output: `dist/` folder with optimized build

### Backend
```bash
cd ujima-loan-pride
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

---

## 🌐 Deployment Options

### Frontend (Vercel, Netlify, GitHub Pages)
```env
VITE_API_URL=https://your-api.herokuapp.com
```

### Backend (Railway, Heroku, AWS)
- Set `GEMINI_API_KEY` environment variable
- Expose port 5000
- Point frontend to your API URL

---

## ✅ Pre-Assessment Checklist

- [ ] Python 3.10+ installed
- [ ] Node.js 16+ installed
- [ ] Google Gemini API key created
- [ ] `.env` file configured with API key
- [ ] `pip install -r requirements.txt` completed
- [ ] `npm install` completed in ujima-landing
- [ ] Both servers starting without errors
- [ ] http://localhost:5173 loads
- [ ] http://localhost:5173/demo loads
- [ ] http://localhost:5000/health returns OK

---

## 📚 Technology Stack

### Frontend
- React 18
- Vite 4
- Tailwind CSS 3
- Framer Motion 10
- Lucide React (Icons)
- React Router 6

### Backend
- Python 3.10+
- Flask 2.3
- Flask-CORS 4.0
- CrewAI 0.11+
- Google Generative AI 0.7+
- LangChain 0.1+
- Pydantic 2.5+

---

## 📝 License

© 2026 Ujima Loan Pride. All Rights Reserved.

---

## 👥 For Assessors

**Complete setup guide:** See `DEPLOYMENT_GUIDE.md`

**Quick issues?** Check:
1. Are both servers running?
2. Is the API key valid?
3. Is Google Cloud Generative Language API enabled?
4. Check logs in `ujima-loan-pride/api.log`

---

**Built with ❤️ for fair lending in Kenya**

🦁 UJIMA LOAN PRIDE - Fair AI-Powered Lending
