# 🎯 AI Interview Prep Platform

> **Real-time coding interview practice with AI-powered feedback on both technical correctness and communication skills**

[![Made with React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.5-6C47FF)](https://anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Why This Project Stands Out

Most interview prep platforms teach you **how to code**. This teaches you **how to interview**.

- ✅ **Real-time AI feedback** - Instant analysis, no waiting
- ✅ **Dual evaluation** - Technical correctness + Communication skills  
- ✅ **24/7 availability** - Practice anytime, no scheduling
- ✅ **Production-ready** - WebSocket, async, error handling

**The Problem:** LeetCode teaches coding. Interview success requires explaining your code clearly. This bridges that gap.

---

## 🎥 Demo

[🎬 Watch Demo Video](#) *(Record and add link)*

![Demo Screenshot](https://via.placeholder.com/800x450/3b82f6/ffffff?text=Add+Screenshot+Here)

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/interview-prep-ai.git
cd interview-prep-ai

# Automated setup
chmod +x setup.sh
./setup.sh

# Or manual setup - see QUICKSTART.md
```

### Run Locally

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Open http://localhost:5173 and start practicing! 🎉

---

## 🏗️ Architecture

```
┌─────────────┐      WebSocket       ┌──────────────┐
│   React     │◄────────────────────►│   FastAPI    │
│  Frontend   │    Real-time comms   │   Backend    │
└─────────────┘                      └──────┬───────┘
                                            │
                                            │ API Calls
                                            ▼
                                     ┌──────────────┐
                                     │  Claude AI   │
                                     │ (Analysis)   │
                                     └──────────────┘
```

**Key Components:**
- **Frontend**: React 18, Monaco Editor, Tailwind CSS
- **Backend**: FastAPI, WebSocket, async Python
- **AI**: Anthropic Claude API with custom prompts
- **Deployment**: Vercel (frontend) + Railway (backend)

[📐 Full Architecture Docs →](./ARCHITECTURE.md)

---

## ✨ Features

### Core Functionality
- 🎤 **Conversational AI interviewer** - Natural interview flow
- 💻 **Monaco code editor** - VS Code experience in browser
- ⚡ **Real-time feedback** - Instant WebSocket communication
- 🎯 **Dual analysis** - Technical + Communication evaluation
- 📊 **Progress tracking** - Session summaries and improvement metrics

### Technical Highlights
- Async/await for non-blocking operations
- WebSocket protocol for bidirectional real-time communication
- Context-aware AI with conversation history
- Multi-language syntax highlighting
- Responsive design (mobile-friendly)

---

## 📸 Screenshots

### Interview Flow

<table>
  <tr>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/3b82f6/ffffff?text=Problem+Input" alt="Problem Input"/>
      <p align="center"><strong>1. Describe Problem</strong></p>
    </td>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Explain+Approach" alt="Explain Approach"/>
      <p align="center"><strong>2. Explain Approach</strong></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/10b981/ffffff?text=Write+Code" alt="Write Code"/>
      <p align="center"><strong>3. Write Code</strong></p>
    </td>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/f59e0b/ffffff?text=Get+Feedback" alt="Get Feedback"/>
      <p align="center"><strong>4. Get AI Feedback</strong></p>
    </td>
  </tr>
</table>

---

## 🎯 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| | Monaco Editor | Code editing |
| | Tailwind CSS | Styling |
| | Vite | Build tool |
| **Backend** | FastAPI | Web framework |
| | Uvicorn | ASGI server |
| | WebSockets | Real-time comms |
| **AI** | Claude Sonnet 4.5 | Code analysis |
| **Deploy** | Vercel + Railway | Hosting |

---

## 📚 Documentation

- [📖 Quick Start Guide](./QUICKSTART.md) - Get running in 10 minutes
- [🚀 Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [📐 Architecture](./ARCHITECTURE.md) - System design details
- [💼 Resume Guide](./RESUME_GUIDE.md) - How to showcase this project
- [🧪 Examples](./EXAMPLES.md) - Test problems and scenarios
- [📂 Project Structure](./PROJECT_STRUCTURE.md) - File organization

---

## 🎓 What You'll Learn

Building this project teaches:
- ✅ Real-time bidirectional communication (WebSocket)
- ✅ AI API integration and prompt engineering
- ✅ Async programming patterns
- ✅ Modern React with hooks
- ✅ System design for scale
- ✅ Production deployment

---

## 🗺️ Roadmap

### ✅ MVP (Complete)
- Real-time code analysis
- AI interview simulation
- Session management
- Multi-language support (Python, JS, Java, C++)

### 🚧 Phase 2 (In Progress)
- [ ] Video recording of sessions
- [ ] Progress dashboard
- [ ] User authentication
- [ ] Session persistence (PostgreSQL)

### 📋 Phase 3 (Planned)
- [ ] Peer review mode
- [ ] Company-specific interview prep
- [ ] Mobile app (React Native)
- [ ] Team features for bootcamps

[📅 Full Roadmap →](./ROADMAP.md)

---

## 🤝 Contributing

This is primarily a portfolio project, but feedback and suggestions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📊 Metrics & Impact

**Current Status:**
- 🎯 **Beta Users**: [Add count after deployment]
- 📈 **Practice Sessions**: [Track after launch]
- ⭐ **Avg. Improvement**: [Measure over 5+ sessions]
- ⏱️ **Response Time**: <3 seconds for AI feedback

**Business Value:**
- Addresses $3B+ interview prep market
- Solves #1 failure reason: poor communication
- Monetization paths: Freemium, B2B, Enterprise

---

## 🔐 Security & Privacy

- ✅ API keys in environment variables only
- ✅ No code stored beyond session duration
- ✅ CORS protection enabled
- ✅ Input validation and sanitization
- ✅ HTTPS in production

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- Portfolio: [your-portfolio.com](#)
- LinkedIn: [linkedin.com/in/yourname](#)
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI API
- **Monaco Editor** - VS Code in the browser
- **FastAPI** - Modern Python web framework
- **React** - UI library

---

## ⭐ Star this repo if it helped you!

Found this useful? Give it a star ⭐ and share with others!

---

<div align="center">

**Built with ❤️ by [Your Name]**

*Demonstrating full-stack development, AI integration, and product thinking*

[⬆ Back to Top](#-ai-interview-prep-platform)

</div>
