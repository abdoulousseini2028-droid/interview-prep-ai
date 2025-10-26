# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (Port 5173)             │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   App.jsx    │  │ Monaco Editor│  │ WebSocket   │ │ │
│  │  │              │  │              │  │  Client     │ │ │
│  │  │ - UI State   │  │ - Code Edit  │  │             │ │ │
│  │  │ - Interview  │  │ - Syntax HL  │  │ - Real-time │ │ │
│  │  │   Flow       │  │ - Multi-lang │  │ - Messages  │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ WebSocket (ws://localhost:8000/ws)
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    FastAPI Backend (Port 8000)               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     main.py                            │ │
│  │                                                        │ │
│  │  ┌──────────────────┐  ┌──────────────────────────┐  │ │
│  │  │  WebSocket       │  │  AI Integration          │  │ │
│  │  │  Handler         │  │                          │  │ │
│  │  │                  │  │  - Code Analysis         │  │ │
│  │  │  - Accept conn   │  │  - Prompt Engineering    │  │ │
│  │  │  - Route msgs    │  │  - Response Parsing      │  │ │
│  │  │  - Send feedback │  │  - Context Management    │  │ │
│  │  └──────────────────┘  └──────────────────────────┘  │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Session Management (In-Memory)           │ │ │
│  │  │                                                  │ │ │
│  │  │  sessions = {                                    │ │ │
│  │  │    "session-123": {                             │ │ │
│  │  │      conversation_history: [...],               │ │ │
│  │  │      code_submissions: [...],                   │ │ │
│  │  │      problem: "...",                            │ │ │
│  │  │    }                                            │ │ │
│  │  │  }                                              │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ HTTPS API Calls
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                  Anthropic Claude API                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Claude Sonnet 4.5 Model                   │ │
│  │                                                        │ │
│  │  Input:                                                │ │
│  │  - System prompt (interviewer persona)                 │ │
│  │  - Conversation history                                │ │
│  │  - Code submission                                     │ │
│  │  - Problem description                                 │ │
│  │                                                        │ │
│  │  Output:                                               │ │
│  │  - Technical feedback                                  │ │
│  │  - Complexity analysis                                 │ │
│  │  - Follow-up questions                                 │ │
│  │  - Communication assessment                            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │
       │ 1. Describes Problem
       ▼
┌─────────────────┐
│  React Frontend │
│   (App.jsx)     │
└────────┬────────┘
         │
         │ 2. WebSocket Message
         │    type: "problem_description"
         ▼
┌─────────────────────┐
│  FastAPI Backend    │
│    (main.py)        │
└──────────┬──────────┘
           │
           │ 3. Store in Session
           │ 4. Request AI Response
           ▼
┌──────────────────────┐
│  Anthropic API       │
│  (Claude)            │
└──────────┬───────────┘
           │
           │ 5. AI Generated Response
           ▼
┌──────────────────────┐
│  FastAPI Backend     │
│  (parse & format)    │
└──────────┬───────────┘
           │
           │ 6. WebSocket Message
           │    type: "ai_response"
           ▼
┌──────────────────────┐
│  React Frontend      │
│  (display feedback)  │
└──────────┬───────────┘
           │
           │ 7. User Sees Feedback
           ▼
┌──────────────────────┐
│      USER            │
└──────────────────────┘
```

## Interview Flow State Machine

```
┌──────────┐
│  START   │
└────┬─────┘
     │
     │ User lands on page
     ▼
┌──────────────────────┐
│  PROBLEM STATE       │
│                      │
│  - Text input        │
│  - Submit button     │
└────────┬─────────────┘
         │
         │ Submit problem → WebSocket: "problem_description"
         ▼
┌──────────────────────┐
│  APPROACH STATE      │
│                      │
│  - Explain strategy  │
│  - AI asks questions │
└────────┬─────────────┘
         │
         │ Submit approach → WebSocket: "explanation"
         ▼
┌──────────────────────┐
│  CODING STATE        │
│                      │
│  - Monaco Editor     │
│  - Write code        │
│  - Chat with AI      │
└────────┬─────────────┘
         │
         │ Submit code → WebSocket: "code_submission"
         ▼
┌──────────────────────┐
│  FEEDBACK STATE      │
│                      │
│  - Score display     │
│  - Analysis panel    │
│  - Suggestions       │
│  - Follow-ups        │
└────────┬─────────────┘
         │
         │ End session → WebSocket: "end_session"
         ▼
┌──────────────────────┐
│  SUMMARY STATE       │
│                      │
│  - Overall assessment│
│  - Strengths         │
│  - Improvements      │
└──────────────────────┘
```

## WebSocket Message Protocol

### Client → Server Messages

```javascript
// 1. Problem Description
{
  type: "problem_description",
  content: "Given an array of integers..."
}

// 2. Approach Explanation
{
  type: "explanation",
  content: "I'll use a hash map because..."
}

// 3. Code Submission
{
  type: "code_submission",
  code: "def two_sum(nums, target):\n    ...",
  language: "python"
}

// 4. Chat Message
{
  type: "message",
  content: "What about edge cases?"
}

// 5. End Session
{
  type: "end_session",
  content: {}
}
```

### Server → Client Messages

```javascript
// 1. System Message
{
  type: "system",
  message: "Welcome! I'm your AI interview coach...",
  timestamp: "2025-10-26T02:00:00Z"
}

// 2. AI Response
{
  type: "ai_response",
  message: "Great approach! Now can you...",
  timestamp: "2025-10-26T02:01:00Z"
}

// 3. Code Analysis
{
  type: "code_analysis",
  analysis: {
    technical_feedback: "Your solution is correct...",
    complexity_analysis: "Time: O(n), Space: O(n)",
    code_quality: "Clean and readable",
    follow_up_question: "How would you handle...",
    score: 8
  },
  timestamp: "2025-10-26T02:02:00Z"
}

// 4. Session Summary
{
  type: "session_summary",
  summary: "Overall, you performed well...",
  session_data: {
    duration: "15 minutes",
    submissions: 2
  }
}

// 5. Error
{
  type: "error",
  message: "Please write some code first!",
  timestamp: "2025-10-26T02:03:00Z"
}
```

## Technology Stack Details

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                       │
├─────────────────────────────────────────────────────────┤
│  React 18.2         │  UI framework                     │
│  Monaco Editor 4.6  │  Code editor (VS Code)            │
│  Tailwind CSS 3.4   │  Utility-first styling            │
│  Lucide React       │  Icon library                     │
│  Vite 5.0           │  Build tool & dev server          │
│  WebSocket API      │  Native browser WebSocket         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    BACKEND STACK                        │
├─────────────────────────────────────────────────────────┤
│  FastAPI 0.109      │  Web framework                    │
│  Uvicorn 0.27       │  ASGI server                      │
│  WebSockets 12.0    │  WebSocket support                │
│  Anthropic 0.18     │  Claude AI client                 │
│  Python 3.11+       │  Runtime                          │
│  Pydantic 2.5       │  Data validation                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                     │
├─────────────────────────────────────────────────────────┤
│  Anthropic API      │  AI model (Claude Sonnet 4.5)     │
│  Vercel             │  Frontend hosting                 │
│  Railway            │  Backend hosting                  │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
                    ┌──────────────────┐
                    │   GitHub Repo    │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐      ┌─────────────────┐
       │  Vercel Deploy  │      │ Railway Deploy  │
       │   (Frontend)    │      │   (Backend)     │
       └────────┬────────┘      └────────┬────────┘
                │                         │
                │                         │
                ▼                         ▼
       ┌─────────────────┐      ┌─────────────────┐
       │  CDN Servers    │      │  App Container  │
       │  Edge Network   │      │  + Environment  │
       └────────┬────────┘      └────────┬────────┘
                │                         │
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   End Users     │
                    │  (Browser)      │
                    └─────────────────┘
```

## Security & Performance

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                       │
├─────────────────────────────────────────────────────────┤
│  1. CORS         │  Restrict origins                    │
│  2. Environment  │  API keys in env vars only           │
│  3. Input Valid  │  Sanitize user inputs                │
│  4. Rate Limit   │  Prevent abuse (future)              │
│  5. HTTPS        │  Encrypted transport                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                PERFORMANCE OPTIMIZATIONS                │
├─────────────────────────────────────────────────────────┤
│  1. WebSocket    │  Lower latency than polling          │
│  2. Async/Await  │  Non-blocking I/O                    │
│  3. Monaco       │  Client-side code editing            │
│  4. Hot Reload   │  Fast development cycle              │
│  5. Vite Build   │  Optimized production bundle         │
└─────────────────────────────────────────────────────────┘
```

## Scalability Considerations

```
Current (MVP):
┌────────────┐
│ 1 Backend  │ → Can handle ~50 concurrent users
└────────────┘

Scaled (Production):
┌────────────┐     ┌────────────┐
│ Backend 1  │     │ Backend 2  │
└──────┬─────┘     └──────┬─────┘
       │                  │
       └────────┬─────────┘
                │
        ┌───────▼────────┐
        │ Load Balancer  │
        └────────────────┘
                │
        ┌───────▼────────┐
        │   PostgreSQL   │ → Session persistence
        │   + Redis      │ → Caching
        └────────────────┘
```

---

This architecture enables:
- ✅ Real-time feedback (WebSocket)
- ✅ Scalable backend (async Python)
- ✅ Modern UI (React + Monaco)
- ✅ Easy deployment (separate services)
- ✅ Cost-effective hosting (~$15/mo)
- ✅ Future extensibility (modular design)
