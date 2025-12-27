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

# This is the most important part for the "Load Failed" error
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
    print(">>> Root endpoint was pinged!")
    return {"status": "online", "message": "Backend is Responding"}

@app.post("/run")
async def execute_code(request: CodeRequest):
    print(f">>> Running code: {request.code[:20]}...")
    output_capture = io.StringIO()
    sys.stdout = output_capture
    try:
        exec(request.code, {"__builtins__": __builtins__}, {})
        result = output_capture.getvalue()
    except Exception as e:
        result = f"Error: {str(e)}"
    finally:
        sys.stdout = sys.__stdout__
    return {"output": result if result.strip() else "Executed (No print output)"}

@app.websocket("/ws/hints")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(">>> AI Voice Connected")
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            prompt = f"Problem: {payload.get('problem')}. User said: {payload.get('transcript')}. Give a 1-sentence hint."
            response = model.generate_content(prompt)
            await websocket.send_json({"hint": response.text.replace("*", "")})
    except Exception as e:
        print(f">>> WebSocket Error: {e}")
