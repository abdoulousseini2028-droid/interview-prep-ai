# 🎯 AI Interview Prep Platform

> Real-time coding interview practice with AI-powered feedback on both technical correctness and communication skills

[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-purple)](https://openai.com)

---

## 🚀 Why This Project Exists

Most interview prep platforms teach you **how to code**. This teaches you **how to interview**.

**The Problem:** LeetCode and similar platforms focus solely on coding ability, but research shows that most candidates fail technical interviews due to **poor communication**, not incorrect code. You can have the right solution but still get rejected if you can't explain your thinking clearly.

**The Solution:** An AI-powered coach that evaluates both your code AND how well you explain it—simulating real interview conditions.

---

## ✨ Key Features

- **Dual Feedback System**: Technical correctness + Communication quality
- **Real-time Analysis**: WebSocket-based instant AI responses
- **Professional Code Editor**: Monaco Editor (VS Code engine) with syntax highlighting
- **Interview Simulation**: Multi-stage flow (Problem → Approach → Code → Feedback)
- **AI-Powered Insights**: Complexity analysis, best practices, follow-up questions

---

## 🏗️ Technical Architecture
```
┌─────────────┐      WebSocket       ┌──────────────┐
│   React     │◄────────────────────►│   FastAPI    │
│  Frontend   │    Real-time comms   │   Backend    │
└─────────────┘                      └──────┬───────┘
                                            │
                                            │ HTTPS
                                            ▼
                                     ┌──────────────┐
                                     │  OpenAI API  │
                                     │  (GPT-3.5)   │
                                     └──────────────┘
```

**Tech Stack:**
- **Frontend**: React 18, Monaco Editor, Tailwind CSS, Vite, WebSocket client
- **Backend**: FastAPI (Python), async/await, WebSocket server, CORS middleware
- **AI**: OpenAI GPT-3.5-turbo with custom prompt engineering
- **Deployment-Ready**: Configured for Vercel (frontend) and Railway (backend)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

**1. Clone the Repository:**
```bash
git clone https://github.com/abdoulousseini2028-droid/interview-prep-ai.git
cd interview-prep-ai
```

**2. Backend Setup:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variable
# Mac/Linux:
export OPENAI_API_KEY="your_api_key_here"
# Windows PowerShell:
$env:OPENAI_API_KEY="your_api_key_here"

# Start backend server
python main.py
```

Server will run on: `http://127.0.0.1:8000`

**3. Frontend Setup (New Terminal):**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

**4. Open Application:**

Navigate to `http://localhost:5173` in your browser.

---

## 💡 How It Works

### User Flow:
1. **Describe Problem**: User inputs a coding challenge
2. **Explain Approach**: AI asks for strategy before coding (simulating real interviews)
3. **Write Code**: Professional Monaco editor with syntax highlighting
4. **Get Feedback**: AI analyzes and provides comprehensive feedback

### AI Evaluation Criteria:
- ✅ **Technical Correctness**: Does the code work? Are there bugs or edge cases?
- ✅ **Complexity Analysis**: Time and space complexity evaluation
- ✅ **Code Quality**: Best practices, readability, naming conventions
- ✅ **Communication**: How clearly did you explain your approach?
- ✅ **Follow-up Questions**: Tests deeper understanding

---

## 🔐 API Key Setup & Cost Information

This project uses the **OpenAI API** which requires an API key and has associated costs.

### Getting Your API Key:

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to [API Keys section](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy and save your key (starts with `sk-proj-...` or `sk-...`)
5. Add to environment: 
   - **Never** commit the key to Git
   - Set as environment variable (see Installation above)
   - Or create `.env` file in `backend/` directory

### Cost Breakdown:

**Typical Usage:**
- ~$0.02-0.05 per interview session
- Average session: 3-5 API calls
- GPT-3.5-turbo pricing: $0.0015/1K input tokens, $0.002/1K output tokens

**Free Credits:**
- New OpenAI accounts may receive $5 in free credits
- Free credits expire after 3 months
- After expiration, pay-as-you-go pricing applies

**Example Costs:**
- 10 practice interviews: ~$0.30-0.50
- 50 practice interviews: ~$1.50-2.50
- 100 practice interviews: ~$3.00-5.00

### Why OpenAI API?

**Technical Benefits:**
- **Semantic Understanding**: Goes beyond pattern matching to understand code context
- **Natural Language Generation**: Produces human-like feedback and explanations
- **Contextual Analysis**: Maintains conversation history for relevant follow-ups
- **Industry Standard**: Demonstrates real-world AI integration skills

**Alternative APIs:**
The codebase is designed to be LLM-agnostic. You can swap OpenAI with:
- **Anthropic Claude**: Similar capabilities, different pricing
- **Google Gemini**: Has free tier with usage limits
- **Local Models**: Ollama, LM Studio (free but requires local GPU)

To switch APIs, modify the client initialization in `backend/main.py`.

### Handling API Errors:

**Common Issues:**

1. **"Error 429 - Insufficient Quota"**
   - **Cause**: No credits remaining or expired free trial
   - **Solution**: Add payment method at https://platform.openai.com/account/billing

2. **"Error 404 - Model Not Found"**
   - **Cause**: Account doesn't have access to GPT-4 (free tier limitation)
   - **Solution**: Code uses GPT-3.5-turbo which all accounts can access

3. **"Error 401 - Authentication Failed"**
   - **Cause**: Invalid or missing API key
   - **Solution**: Verify key is set correctly and hasn't been revoked

### Professional Explanation (For Interviews):

*"The platform integrates with OpenAI's GPT-3.5 API to provide intelligent code analysis at approximately $0.03 per interview session. While this requires an API key and has associated costs, it enables semantic understanding of code rather than just pattern matching—catching logical errors and providing nuanced feedback that rules-based systems can't deliver.*

*The architecture is designed to be LLM-agnostic, so it could easily be adapted to use other providers like Anthropic Claude or Google Gemini depending on cost/performance requirements. For a production deployment, I'd implement API key management, rate limiting, usage analytics, and potentially a freemium model where users get X free sessions before upgrading."*

---

## 📊 Project Highlights

**What Makes This Different:**
- ❌ Not a LeetCode clone (they don't teach communication)
- ❌ Not a generic chatbot (purpose-built for interviews)
- ✅ Simulates real interview conditions
- ✅ Dual evaluation system (unique approach)
- ✅ Production-ready architecture

**Skills Demonstrated:**
- Full-stack development (React + Python)
- Real-time bidirectional communication (WebSocket)
- AI/ML API integration & prompt engineering
- Async programming patterns
- Error handling & user experience design
- Environment variable management & security
- Modern deployment practices

---

## 🎯 Future Enhancements

- [ ] Multi-language support (Java, C++, JavaScript, Go)
- [ ] Video/audio recording of practice sessions
- [ ] Progress tracking dashboard with analytics
- [ ] User authentication (Auth0/Clerk)
- [ ] Company-specific interview prep modes (Google, Meta, Amazon)
- [ ] Peer review and community features
- [ ] Mock interview scheduling with live AI
- [ ] Integration with LeetCode/HackerRank problems
- [ ] Mobile app (React Native)
- [ ] Export interview transcripts as PDF

---

## 🚢 Deployment

### Frontend (Vercel):

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Framework: Vite
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy!

### Backend (Railway):

1. Create new project at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Root directory: `backend`
4. Add environment variable: `OPENAI_API_KEY=your_key`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy!

**Update Frontend API URL:**

After deploying backend, update `frontend/src/App.jsx`:
```javascript
const WS_URL = 'ws://your-backend-url.railway.app/ws'
```

---

## 🐛 Troubleshooting

### "Module 'openai' not found"
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### "WebSocket connection failed"
- Check that backend is running on port 8000
- Check that frontend is connecting to correct URL
- Verify no firewall blocking WebSocket connections

### "API Key Error"
```bash
# Verify environment variable is set
echo $OPENAI_API_KEY  # Mac/Linux
echo $env:OPENAI_API_KEY  # Windows PowerShell
```

### "Frontend won't start"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 License

MIT License - feel free to fork and build upon this project.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-3.5 API enabling intelligent code analysis
- **Monaco Editor** (Microsoft) for professional code editing experience
- **FastAPI** for elegant async Python web framework
- **React** and **Vite** for modern frontend development

---

## 👤 Author

**Abdoul Rahim Ousseini**
- GitHub: [@abdoulousseini2028-droid](https://github.com/abdoulousseini2028-droid)
- LinkedIn: [abdoul-rahim-ousseini](https://linkedin.com/in/abdoul-rahim-ousseini-246854245)
- Email: ousseiniabdoulrahim1@gmail.com

---

## 📈 Project Stats

- **Lines of Code**: ~1,200+
- **Development Time**: 10 hours (following agile sprint methodology)
- **Technologies**: 8+ (React, FastAPI, OpenAI, WebSocket, etc.)
- **API Integrations**: 1 (OpenAI GPT-3.5)

---

**Built to demonstrate modern full-stack development, AI integration, and product thinking.**

*If this project helped you prepare for interviews, give it a ⭐ on GitHub!*
