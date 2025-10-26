# Project Structure

```
interview-prep-ai/
├── README.md                  # Main project documentation
├── DEPLOYMENT.md             # Deployment guide (Vercel, Railway, Docker)
├── EXAMPLES.md               # Test problems and scenarios
├── RESUME_GUIDE.md           # How to showcase this project
├── setup.sh                  # Quick start installation script
├── .gitignore               # Git ignore patterns
│
├── backend/                  # Python FastAPI backend
│   ├── main.py              # Main server with WebSocket endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
│
└── frontend/                 # React frontend
    ├── index.html           # HTML entry point
    ├── package.json         # Node dependencies
    ├── vite.config.js       # Vite build configuration
    ├── tailwind.config.js   # Tailwind CSS config
    ├── postcss.config.js    # PostCSS config
    │
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Main application component
        └── index.css        # Global styles with Tailwind
```

## File Descriptions

### Root Level
- **README.md**: Complete project overview, features, setup instructions
- **DEPLOYMENT.md**: Production deployment guides for multiple platforms
- **EXAMPLES.md**: Sample problems, test scenarios, demo scripts
- **RESUME_GUIDE.md**: How to present this project in interviews/resume
- **setup.sh**: Automated setup script for quick start

### Backend (`/backend`)
- **main.py**: 
  - FastAPI application with CORS middleware
  - WebSocket endpoint for real-time communication
  - AI integration with Anthropic Claude
  - Session management
  - Code analysis functions
  
- **requirements.txt**: 
  - fastapi: Web framework
  - uvicorn: ASGI server
  - websockets: Real-time communication
  - anthropic: Claude AI client
  - python-dotenv: Environment management

- **.env.example**: Template for API keys and configuration

### Frontend (`/frontend`)
- **index.html**: HTML shell for React app

- **package.json**: 
  - React 18: UI framework
  - Monaco Editor: Code editor (VS Code)
  - Lucide React: Icons
  - Vite: Build tool
  - Tailwind CSS: Styling

- **src/App.jsx**: Main application logic
  - WebSocket connection management
  - Interview flow state machine
  - Code editor integration
  - Real-time chat interface
  - Feedback display

- **src/main.jsx**: React entry point

- **src/index.css**: 
  - Tailwind base styles
  - Custom component classes
  - Scrollbar styling

## Key Features by File

### Backend (main.py)
✅ WebSocket real-time communication
✅ AI-powered code analysis
✅ Session management
✅ Structured feedback generation
✅ Error handling
✅ CORS configuration

### Frontend (App.jsx)
✅ Monaco editor integration
✅ Multi-stage interview flow
✅ Real-time chat interface
✅ Code submission & feedback
✅ Responsive design
✅ Loading states

## Architecture Flow

```
User Browser
    ↓
React App (App.jsx)
    ↓
WebSocket Connection
    ↓
FastAPI Server (main.py)
    ↓
Anthropic Claude API
    ↓
AI Analysis Response
    ↓
Real-time Feedback
    ↓
User Interface Update
```

## Development Workflow

1. **Setup**: Run `./setup.sh`
2. **Backend**: `cd backend && python main.py`
3. **Frontend**: `cd frontend && npm run dev`
4. **Development**: Make changes, hot reload active
5. **Testing**: Use EXAMPLES.md test problems
6. **Deploy**: Follow DEPLOYMENT.md

## Production Considerations

### What's Included (MVP):
- ✅ Real-time WebSocket communication
- ✅ AI code analysis
- ✅ Interactive interview flow
- ✅ Session management (in-memory)
- ✅ Error handling
- ✅ Responsive UI

### What to Add (Production):
- [ ] PostgreSQL database
- [ ] User authentication
- [ ] Redis caching
- [ ] Rate limiting
- [ ] Analytics tracking
- [ ] Session persistence
- [ ] Video recording
- [ ] Progress dashboard

## File Sizes (Approximate)

```
main.py:         ~300 lines  (Core backend logic)
App.jsx:         ~400 lines  (Frontend UI)
README.md:       ~200 lines  (Documentation)
RESUME_GUIDE.md: ~250 lines  (Career guidance)
EXAMPLES.md:     ~200 lines  (Test cases)
DEPLOYMENT.md:   ~150 lines  (Deploy guides)
```

**Total Code**: ~1,500 lines
**Languages**: Python, JavaScript, CSS
**Build Time**: ~10 hours for MVP

## Quick Reference

### Start Backend
```bash
cd backend
source venv/bin/activate
python main.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Deploy
```bash
# Frontend
cd frontend && vercel

# Backend
# Push to GitHub, connect to Railway
```

### Environment Setup
```bash
# Backend
ANTHROPIC_API_KEY=your_key_here

# Frontend
VITE_WS_URL=ws://localhost:8000/ws
```

## Dependencies Overview

**Backend (7 packages)**
- FastAPI ecosystem: 4 packages
- AI integration: 1 package
- Utilities: 2 packages

**Frontend (15 packages)**
- React ecosystem: 5 packages
- UI/Styling: 4 packages
- Build tools: 6 packages

**Total**: ~22 dependencies (lightweight!)

---

**This structure enables:**
- Fast development (hot reload)
- Easy deployment (separate services)
- Clear separation of concerns
- Scalable architecture
- Simple maintenance
