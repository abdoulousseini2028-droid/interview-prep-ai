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
        "You are a world-class Senior Technical Interviewer. "
        "Your goal is to guide the candidate with 1-2 short sentences. "
        "Never use Markdown, asterisks (**), or hashtags (#). "
        "If the candidate is silent, ask them to talk through their logic. "
        "If they are stuck, give a high-level conceptual hint, not the code."
    )
)

app = FastAPI()

# Extreme CORS settings to bypass "Unreachable" errors
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
    return {"status": "online", "message": "AI Backend is active"}

# --- ROUTE 1: RUN CODE ---
@app.post("/run")
async def execute_code(request: CodeRequest):
    # This ensures the backend captures EVERYTHING printed
    output_capture = io.StringIO()
    sys.stdout = output_capture
    try:
        # Use a local dict to avoid global variable conflicts
        local_scope = {}
        exec(request.code, {"__builtins__": __builtins__}, local_scope)
        result = output_capture.getvalue()
    except Exception as e:
        result = f"Error: {str(e)}"
    finally:
        sys.stdout = sys.__stdout__
    return {"output": result}
# --- ROUTE 2: WEBSOCKET AI HINTS ---
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
            
            prompt = (
                f"Candidate is working on: {problem}. "
                f"Current Code: {current_code}. "
                f"Candidate just said: '{user_speech}'. "
                "Give a natural-sounding spoken hint."
            )
            
            response = model.generate_content(prompt)
            # Clean text for Text-to-Speech
            clean_hint = response.text.replace("*", "").replace("#", "").strip()
            
            await websocket.send_json({"hint": clean_hint})
    except WebSocketDisconnect:
        print("Websocket closed")
    except Exception as e:
        print(f"Error: {e}")
