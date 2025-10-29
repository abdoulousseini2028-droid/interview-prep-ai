# AI Interview Prep Platform

**👉 [Try the Live Demo](https://interview-prep-ai-delta.vercel.app)** - Click and start practicing immediately!

> Real-time coding interview practice with AI feedback on both your code AND communication skills

[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-purple)](https://openai.com)

---

## Try It Now

**[Launch the app →](https://interview-prep-ai-delta.vercel.app)**

1. **Enter a coding problem** - Try: "Find two numbers in an array that sum to a target"
2. **Explain your approach** - Describe your strategy before coding
3. **Write your code** - Use the professional Monaco editor (VS Code's engine)
4. **Get feedback** - See why the AI can't analyze... yet!

Note: As a student portfolio project (so far), I didn't not load API credits for the public demo to avoid unexpected costs from random traffic. I'd still highly appreciate if you interact with it to get an idea of what the AI is supposed to do (and for feedback). Click "Launch the App" link above before reading any further, and follow step 1 through 4. However because of the lack of API credits, you'll get a friendly error message describing what I've just said here, after STEP 4. However it fully work if you clone it and run locally with your own OpenAI API key

##  What Problem Does This Solve?

**LeetCode teaches how to code. This teaches you how to interview.**

Some of the best leedcoders I know use pen (or pencil) and paper to design a strategy before writing any actual line of code for a leetcode problem. This beta-version of InterviewPrep AI (with loaded API credits) has that pen/pencil and paper integrated in it. It trains coders who struggle with explaining their code to become more confident in their "communication" abilities in order to pass technical interviews. It does that through the "explain your strategy feature." At the end, it gives feedback both on the code but also how well you communicated your strategy before writing the code. 


---

### Quick Start (5 minutes):

**1. Prerequisites:**
```bash
- Python 3.11+
- Node.js 18+
- OpenAI API key (new accounts get $5 free credits!)
```

**2. Clone the Repository:**
```bash
git clone https://github.com/abdoulousseini2028-droid/interview-prep-ai.git
cd interview-prep-ai
```

**3. Backend Setup:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Get your API key from: https://platform.openai.com/api-keys
# Set environment variable
export OPENAI_API_KEY="your-key-here"  # Mac/Linux
$env:OPENAI_API_KEY="your-key-here"    # Windows PowerShell

# Start backend
python main.py
```

Backend runs on: `http://127.0.0.1:8000`

**4. Frontend Setup (new terminal):**
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

**5. Use It!**

Open `http://localhost:5173` and experience the full AI-powered interview coach!

---

**Tech Stack:**

**Frontend:**
- React 18 with Vite for fast builds
- Monaco Editor (VS Code's code editor)
- Tailwind CSS for styling
- WebSocket client for real-time communication
- Lucide React for icons

**Backend:**
- FastAPI (Python async framework)
- WebSocket server for bidirectional communication
- OpenAI GPT-3.5-turbo API integration
- CORS middleware for cross-origin requests
- In-memory session management

**Deployment:**
- Frontend: Vercel (auto-deploy from GitHub)
- Backend: Render (containerized Python app)
- Environment variables for API key security

---

##  About OpenAI API Costs

### Why No API Key in the Live Demo?

As a student portfolio project, for financial reason, I could not to load API credits for the public demo to avoid unexpected costs from random traffic. 


---

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Video/audio recording of practice sessions
- [ ] Company-specific interview prep modes (Google, Meta, Amazon style)
- [ ] Mock interview schedulin with live AI interviewer


---

## Troubleshooting

### Live Demo Issues:

**"WebSocket connection failed"**
- The backend might be sleeping (Render free tier spins down after inactivity)
- Wait 30-60 seconds and refresh the page
- Check browser console for specific errors

**"An error occurred" after submitting**
- This means the demo is working correctly! The error explains why AI isn't available
- Clone the repo and run locally with your own API key to see it work

### Local Setup Issues:

**"Module 'openai' not found"**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**"WebSocket connection failed" (locally)**
- Verify backend is running on port 8000
- Check that frontend is connecting to correct URL in `App.jsx`
- Ensure no firewall blocking WebSocket connections

**"API Key Error"**
```bash
# Verify environment variable is set
echo $OPENAI_API_KEY  # Mac/Linux
echo $env:OPENAI_API_KEY  # Windows PowerShell

# Should print your API key starting with sk-proj- or sk-
```
-----------

---

## 🚢 Deployment Guide

### Deploy Your Own Instance:

**Frontend (Vercel):**
1. Fork this repository
2. Import project at [vercel.com](https://vercel.com)
3. Framework: Vite
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy!

**Backend (Render):**
1. Create new Web Service at [render.com](https://render.com)
2. Connect your GitHub repository
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `OPENAI_API_KEY=your_key`
7. Deploy!

**Update Frontend API URL:**

After deploying backend, update `frontend/src/App.jsx`:
```javascript
const WS_URL = 'wss://your-backend-url.onrender.com/ws'
```

---

## 📝 License

MIT License - Feel free to fork, learn from, and build upon this project!

---

## 👤 About

**Abdoul Rahim Ousseini**  
Northwestern University | Computer Science + Mathematics '28  
Buffett Scholar (< 0.5% acceptance rate)

- **LinkedIn:** [linkedin.com/in/abdoul-rahim-ousseini-246854245](https://linkedin.com/in/abdoul-rahim-ousseini-246854245)
- **Email:** [ousseiniabdoulrahim1@gmail.com](mailto:ousseiniabdoulrahim1@gmail.com)

### Other Projects:

- **[Expense Splitter](https://github.com/abdoulousseini2028-droid/expense-splitter)** - Real-time expense tracking with Supabase
- **[Superstore Sales Analysis](https://github.com/abdoulousseini2028-droid/superstore-sales-analysis)** - SQL-based retail data analysis
