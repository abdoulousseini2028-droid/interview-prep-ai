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

# Defining the "Senior Interviewer" persona
model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=(
        "You are a Senior Technical Interviewer. Your goal is to guide the candidate. "
        "Keep responses short (1-2 sentences). Speak naturally. Do not use Markdown, "
        "asterisks, or hashtags. If they haven't spoken much, encourage them to "
        "explain their thought process."
    )
)

app = FastAPI()

# ULTIMATE CORS SETUP: This helps fix the "Unreachable" error on Private Ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

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
        # Standard exec for local dev
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
            current_code = payload.get("code", "")
            
            # The "Brain" logic
            prompt = (
                f"Candidate is working on: {problem}. "
                f"Current Python code: {current_code}. "
                f"Candidate said: '{user_speech}'. "
                "Provide a spoken hint or words of encouragement. Be brief."
            )
            
            response = model.generate_content(prompt)
            # Clean up text so text-to-speech sounds natural
            clean_hint = response.text.replace("*", "").replace("#", "").strip()
            
            await websocket.send_json({"hint": clean_hint})
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in websocket: {e}")
