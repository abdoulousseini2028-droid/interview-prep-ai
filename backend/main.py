import os
import json
import io
import sys
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# We use a system_instruction to define the AI's "Voice Personality"
model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=(
        "You are a world-class Senior Technical Interviewer. "
        "Your goal is to guide the candidate without giving away the answer. "
        "Speak in a professional, encouraging, and concise manner. "
        "Never use Markdown, bolding (**), or code blocks because your response "
        "will be read aloud by a text-to-speech engine. Keep hints to 1 or 2 short sentences."
    )
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

# New health check route to confirm backend is alive
@app.get("/")
async def root():
    return {"message": "backend is running"}

# --- ROUTE 1: RUN CODE ---
@app.post("/run")
async def execute_code(request: CodeRequest):
    output_capture = io.StringIO()
    sys.stdout = output_capture
    error = None
    
    try:
        # Note: In a production app, we'd use a sandbox. For learning, exec is okay.
        exec(request.code, {"__builtins__": __builtins__}, {})
    except Exception as e:
        error = str(e)
    finally:
        sys.stdout = sys.__stdout__
        
    result = output_capture.getvalue()
    return {"output": result if not error else f"Error: {error}"}

# --- ROUTE 2: AI VOICE HINTS ---
@app.websocket("/ws/hints")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            user_speech = payload.get("transcript", "")
            problem = payload.get("problem", "")
            current_code = payload.get("code", "") # Now we track the code too!
            
            # This prompt tells Gemini exactly what to analyze
            prompt = (
                f"The candidate is solving this problem: {problem}. "
                f"Their current code is: {current_code}. "
                f"They just said this to you: '{user_speech}'. "
                "Based on their speech and code, give them a subtle hint to move them forward. "
                "If they are on the right track, just give a quick word of encouragement."
            )
            
            response = model.generate_content(prompt)
            # Remove any stray asterisks or symbols the AI might include
            clean_hint = response.text.replace("*", "").replace("#", "").strip()
            
            await websocket.send_json({"hint": clean_hint})
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Error: {e}")
