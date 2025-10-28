# 🎯 AI Interview Prep Platform

**👉 [Try the Live Demo](https://interview-prep-ai-delta.vercel.app)** - Click and start practicing immediately!

> Real-time coding interview practice with AI feedback on both your code AND communication skills

[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-purple)](https://openai.com)

---

## 🎮 Try It Now

**[Launch the app →](https://interview-prep-ai-delta.vercel.app)**

1. **Enter a coding problem** - Try: "Find two numbers in an array that sum to a target"
2. **Explain your approach** - Describe your strategy before coding
3. **Write your code** - Use the professional Monaco editor (VS Code's engine)
4. **Get feedback** - See why the AI can't analyze... yet!

### About the Demo

The app is **fully functional** - you can interact with the UI, type in the code editor, and experience the complete interview flow. However, when you submit code for review, you'll see a friendly message explaining that AI analysis isn't available.

**Why?** This is a portfolio/demo project. The AI analysis costs ~$0.03 per session using OpenAI's API. To avoid unexpected charges from public traffic, I haven't loaded API credits for the live demo. This demonstrates **real-world cost management** thinking for production deployments.

---

## 💡 What Problem Does This Solve?

**LeetCode teaches you how to code. This teaches you how to interview.**

Most candidates fail technical interviews not because their code is wrong - they fail because they can't explain their thinking clearly. You can have the perfect solution but still get rejected if you can't communicate your approach.

**The gap:** Existing platforms focus solely on coding ability, but real interviews evaluate:
- ✅ Technical correctness
- ✅ Communication clarity
- ✅ Problem-solving process

This platform evaluates **both** - just like a real interviewer would.

---

## ✨ Features

### What You Can Try in the Live Demo:

- **Multi-Stage Interview Flow** - Problem description → Approach explanation → Code → Feedback
- **Professional Code Editor** - Monaco Editor (VS Code's engine) with:
  - Syntax highlighting
  - Multiple language support (Python, JavaScript, Java, C++)
  - IntelliSense-like features
- **Real-Time WebSocket Communication** - Instant responses as you progress
- **Clean, Interview-Focused UI** - Distraction-free practice environment

### What Works With Your Own API Key:

- **Dual AI Feedback System** - Analyzes both code correctness AND explanation quality
- **Complexity Analysis** - Time/space complexity evaluation
- **Best Practices Review** - Code quality and style feedback
- **Smart Follow-Up Questions** - Tests deeper understanding
- **Conversation History** - Maintains context throughout the session

---

## 🚀 Run It Yourself (See the AI Actually Work!)

Want to experience the full AI-powered feedback? Clone and run locally with your own OpenAI API key:

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

## 🏗️ Technical Architecture

```
┌─────────────┐      WebSocket       ┌──────────────┐      HTTPS      ┌──────────────┐
│   React     │◄────────────────────►│   FastAPI    │────────────────►│  OpenAI API  │
│  Frontend   │    Real-time comms   │   Backend    │   AI Analysis   │  (GPT-3.5)   │
└─────────────┘                      └──────────────┘                 └──────────────┘
```

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

## 💰 About OpenAI API Costs

### Why No API Key in the Live Demo?

As a student portfolio project, I chose not to load API credits for the public demo to avoid unexpected costs from random traffic. This demonstrates:
- Cost-awareness in production systems
- Proper API key management
- Professional deployment thinking

### Cost Breakdown:

**Typical Usage:**
- ~$0.02-0.03 per interview session
- Average session: 3-5 API calls
- GPT-3.5-turbo pricing: $0.0015/1K input tokens, $0.002/1K output tokens

**Free Credits:**
- New OpenAI accounts get $5 in free credits
- Free credits expire after 3 months
- $5 = approximately 150-200 practice sessions

**Example Costs:**
- 10 practice interviews: ~$0.30
- 50 practice interviews: ~$1.50
- 100 practice interviews: ~$3.00

### In Production:

For a real deployment, I would implement:
- User authentication (Auth0/Clerk)
- Rate limiting (5 free sessions per user)
- Usage analytics and monitoring
- Freemium model with paid unlimited access
- Budget alerts and spending caps

---

## 📊 Skills Demonstrated

### Technical Skills:

- ✅ **Full-Stack Development** - React frontend + Python backend
- ✅ **Real-Time Communication** - WebSocket bidirectional data flow
- ✅ **AI Integration** - OpenAI API with custom prompt engineering
- ✅ **Async Programming** - FastAPI async/await patterns
- ✅ **Modern Tooling** - Vite, Tailwind CSS, Monaco Editor
- ✅ **Error Handling** - Graceful failures and user feedback
- ✅ **Security** - Environment variables, .gitignore best practices
- ✅ **Deployment** - Production-ready on Vercel and Render

### Product Thinking:

- ✅ **Problem Identification** - Recognized gap in interview prep market
- ✅ **User-Centric Design** - Clean, interview-focused interface
- ✅ **Cost Management** - Strategic API usage decisions
- ✅ **Deployment Strategy** - Production-ready architecture

---

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Progress tracking dashboard with analytics
- [ ] Multi-language support (Java, C++, Go, Rust)
- [ ] Video/audio recording of practice sessions
- [ ] Company-specific interview prep modes (Google, Meta, Amazon style)
- [ ] Mock interview scheduling with live AI interviewer
- [ ] Peer review and community features
- [ ] Integration with LeetCode/HackerRank problems
- [ ] Export interview transcripts as PDF
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

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

---

## 📁 Project Structure

```
interview-prep-ai/
├── backend/
│   ├── main.py              # FastAPI app with WebSocket endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .python-version      # Python version specification
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Tailwind CSS
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
├── .gitignore              # Git ignore patterns
└── README.md               # This file
```

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

- **Portfolio:** [Your Portfolio Site]
- **LinkedIn:** [linkedin.com/in/abdoul-rahim-ousseini-246854245](https://linkedin.com/in/abdoul-rahim-ousseini-246854245)
- **Email:** [ousseiniabdoulrahim1@gmail.com](mailto:ousseiniabdoulrahim1@gmail.com)
- **GitHub:** [@abdoulousseini2028-droid](https://github.com/abdoulousseini2028-droid)

### Other Projects:

- **[Expense Splitter](https://github.com/abdoulousseini2028-droid/expense-splitter)** - Real-time expense tracking with Supabase
- **[Superstore Sales Analysis](https://github.com/abdoulousseini2028-droid/superstore-sales-analysis)** - SQL-based retail data analysis

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-3.5 API enabling intelligent code analysis
- **Monaco Editor** (Microsoft) for professional code editing experience
- **FastAPI** for elegant async Python web framework
- **React** and **Vite** for modern frontend development

---

## 📈 Project Stats

- **Development Time:** 12 hours (agile sprint methodology)
- **Lines of Code:** ~1,500+
- **Technologies Used:** 8+ (React, FastAPI, OpenAI, WebSocket, MongoDB-inspired sessions, etc.)
- **API Integrations:** 1 (OpenAI GPT-3.5)

---

**Built to demonstrate modern full-stack development, AI integration, and production-level thinking.**

**Questions or want to see it working with full AI?** Reach out!

*⭐ Star this repo if you found it interesting or helpful!*
