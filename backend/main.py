import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Setup Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
# Using Gemini 2.0 Flash for low latency (perfect for voice)
model = genai.GenerativeModel('gemini-2.0-flash-exp') 

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allows your frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/hints")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected to voice coach")
    
    # We start a chat session to keep context of the hints
    chat = model.start_chat(history=[])
    
    system_prompt = (
        "You are a coding interview coach. The user is solving a problem and speaking aloud. "
        "They have paused, which means they are stuck. Provide a SHORT (1-2 sentence) hint. "
        "Do not give the code solution. Just guide their thinking."
    )

    try:
        while True:
            # Receive data from frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            problem = payload.get("problem", "")
            code_so_far = payload.get("code", "")
            transcript = payload.get("transcript", "")

            full_prompt = (
                f"{system_prompt}\n\n"
                f"Problem: {problem}\n"
                f"Current Code:\n{code_so_far}\n"
                f"User's last thoughts: {transcript}"
            )

            # Get hint from Gemini
            response = chat.send_message(full_prompt)
            
            # Send back to frontend
            await websocket.send_json({"hint": response.text})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
