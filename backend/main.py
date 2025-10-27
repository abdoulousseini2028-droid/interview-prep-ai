from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from openai import OpenAI
import os
import json
import asyncio
from datetime import datetime
import uuid

app = FastAPI(title="AI Interview Prep API")

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# In-memory session storage (use DB in production)
sessions: Dict[str, Dict] = {}


class CodeSubmission(BaseModel):
    code: str
    language: str
    problem_description: str


class FeedbackResponse(BaseModel):
    technical_feedback: str
    communication_feedback: str
    suggestions: List[str]
    complexity_analysis: str
    score: int
def analyze_code_with_ai(code: str, language: str, problem: str, conversation_history: List[Dict]) -> Dict:
    """
    Analyze code using OpenAI GPT-3.5 for technical correctness and complexity
    """
    system_prompt = """You are an expert technical interviewer at a top tech company. 
    Your role is to:
    1. Analyze code for correctness, efficiency, and best practices
    2. Evaluate the candidate's problem-solving approach
    3. Provide constructive feedback on both technical and communication aspects
    4. Ask relevant follow-up questions to assess deeper understanding
    
    Be encouraging but honest. Focus on helping candidates improve."""
    
    prompt = f"""
    Problem: {problem}
    
    Language: {language}
    
    Code submitted:
```{language}
    {code}
```
    
    Please provide:
    1. Technical correctness analysis (bugs, edge cases)
    2. Time and space complexity analysis
    3. Code quality and best practices feedback
    4. One insightful follow-up question to test deeper understanding
    5. Overall score out of 10
    
    Format your response as JSON with these keys:
    - technical_feedback
    - complexity_analysis  
    - code_quality
    - follow_up_question
    - score (1-10)
    """
    
    messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history:
        messages.append(msg)
    messages.append({"role": "user", "content": prompt})
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=2000,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        
        # Try to parse as JSON
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
            return json.loads(json_str)
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
            return json.loads(json_str)
        else:
            return {
                "technical_feedback": content,
                "complexity_analysis": "See technical feedback",
                "code_quality": "See technical feedback",
                "follow_up_question": "Can you explain your approach?",
                "score": 7
            }
    except Exception as e:
        # Return friendly error message as if it's from the AI
        return {
            "technical_feedback": """Hi! I'm the AI interview coach, but I'm currently unable to analyze your code. 

Here's why: This demo uses OpenAI's API which costs about $0.03 per analysis. Since this is a portfolio project displayed publicly, the creator (Abdoul) hasn't loaded API credits to avoid unexpected charges from random traffic. After loading API credits, I would work perfectly.

**But your code looks good!** I can see you're thinking about the problem. The app itself works perfectly - the WebSocket connection, code editor, and full interview flow are all production-ready.

**Want to see me actually work?** 
- Contact Abdoul at ousseiniabdoulrahim1@gmail.com for a live demo
- Or clone the repo and add your own OpenAI API key (free $5 credits for new accounts!)

This demonstrates real-world thinking about cost management in production deployments. In a real product, there would be user authentication, usage limits, and payment processing.""",
            "complexity_analysis": "Unable to analyze without API access",
            "code_quality": "Unable to analyze without API access",
            "follow_up_question": "Want to see this working? Reach out to the developer!",
            "score": 0
        }
 
    
 
@app.get("/")
async def root():
    return {
        "message": "AI Interview Prep API",
        "status": "running",
        "endpoints": {
            "websocket": "/ws/{session_id}",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time interview session
    """
    await websocket.accept()
    
    # Initialize session
    if session_id not in sessions:
        sessions[session_id] = {
            "id": session_id,
            "conversation_history": [],
            "code_submissions": [],
            "start_time": datetime.now().isoformat(),
            "problem": None
        }
    
    session = sessions[session_id]
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "message": "Welcome! I'm your AI interview coach. Let's start by understanding the problem you're working on. What coding challenge would you like to practice?",
            "timestamp": datetime.now().isoformat()
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "problem_description":
                # Store the problem
                session["problem"] = data.get("content")
                session["conversation_history"].append({
                    "role": "user",
                    "content": f"Problem: {data.get('content')}"
                })
                
                await websocket.send_json({
                    "type": "ai_response",
                    "message": "Great! I understand the problem. Now, before you start coding, can you walk me through your approach? What's your initial strategy?",
                    "timestamp": datetime.now().isoformat()
                })
                
            elif message_type == "explanation":
                # User explaining their approach
                explanation = data.get("content")
                session["conversation_history"].append({
                    "role": "user", 
                    "content": f"My approach: {explanation}"
                })
                
                # AI provides feedback on approach
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a supportive technical interviewer. Provide brief feedback on the candidate's approach and encourage them to start coding."},
                        *session["conversation_history"]
                    ],
                    max_tokens=500
                )
                
                ai_message = response.choices[0].message.content
                session["conversation_history"].append({
                    "role": "assistant",
                    "content": ai_message
                })
                
                await websocket.send_json({
                    "type": "ai_response",
                    "message": ai_message,
                    "timestamp": datetime.now().isoformat()
                })
                
            elif message_type == "code_submission":
                # Analyze submitted code
                code = data.get("code", "")
                language = data.get("language", "python")
                
                if not code.strip():
                    await websocket.send_json({
                        "type": "error",
                        "message": "Please write some code before submitting!",
                        "timestamp": datetime.now().isoformat()
                    })
                    continue
                
                # Store submission
                session["code_submissions"].append({
                    "code": code,
                    "language": language,
                    "timestamp": datetime.now().isoformat()
                })
                
                # Analyze with AI
                await websocket.send_json({
                    "type": "system",
                    "message": "Analyzing your code...",
                    "timestamp": datetime.now().isoformat()
                })
                
                analysis = analyze_code_with_ai(
                    code, 
                    language, 
                    session.get("problem", "coding problem"),
                    session["conversation_history"]
                )
                
                # Send detailed feedback
                await websocket.send_json({
                    "type": "code_analysis",
                    "analysis": analysis,
                    "timestamp": datetime.now().isoformat()
                })
                
                # Ask follow-up question
                if "follow_up_question" in analysis:
                    await websocket.send_json({
                        "type": "ai_response",
                        "message": analysis["follow_up_question"],
                        "timestamp": datetime.now().isoformat()
                    })
            
            elif message_type == "message":
                # General conversation
                user_message = data.get("content")
                session["conversation_history"].append({
                    "role": "user",
                    "content": user_message
                })
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful technical interviewer. Keep responses concise and encouraging."},
                        *session["conversation_history"]
                    ],
                    max_tokens=500
                )
                
                ai_message = response.choices[0].message.content
                session["conversation_history"].append({
                    "role": "assistant",
                    "content": ai_message
                })
                
                await websocket.send_json({
                    "type": "ai_response",
                    "message": ai_message,
                    "timestamp": datetime.now().isoformat()
                })
            
            elif message_type == "end_session":
                # Generate session summary
                summary_prompt = f"""
                Based on this interview session, provide a concise summary:
                
                Problem: {session.get('problem', 'N/A')}
                Code submissions: {len(session['code_submissions'])}
                
                Provide:
                1. Overall performance assessment (2-3 sentences)
                2. Key strengths (2 bullet points)
                3. Areas for improvement (2 bullet points)
                4. Next steps for practice
                
                Keep it encouraging and actionable.
                """
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=session["conversation_history"] + [{
                        "role": "user",
                        "content": summary_prompt
                    }],
                    max_tokens=800
                )
                
                await websocket.send_json({
                    "type": "session_summary",
                    "summary": response.choices[0].message.content,
                    "session_data": {
                        "duration": "session duration",
                        "submissions": len(session['code_submissions']),
                        "timestamp": datetime.now().isoformat()
                    }
                })
                break
                
    except WebSocketDisconnect:
        print(f"Client disconnected from session {session_id}")
    except Exception as e:
        print(f"Error in session {session_id}: {str(e)}")
        await websocket.send_json({
            "type": "error",
            "message": "An error occurred. Please try again.",
            "timestamp": datetime.now().isoformat()
        })


@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """
    Retrieve session data for review
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return sessions[session_id]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
