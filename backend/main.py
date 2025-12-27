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
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

# Setup CORS - Allow everything for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

# --- ROUTE 1: RUN CODE ---
@app.post("/run")
async def execute_code(request: CodeRequest):
    output_capture = io.StringIO()
    sys.stdout = output_capture
    error = None
    
    try:
        # Warning: exec() is for local learning projects only!
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
            
            prompt = (
                f"User is solving: {problem}. "
                f"They just said: '{user_speech}'. "
                f"Give a 1-sentence helpful hint. No code."
            )
            
            response = model.generate_content(prompt)
            await websocket.send_json({"hint": response.text})
    except WebSocketDisconnect:
        pass
