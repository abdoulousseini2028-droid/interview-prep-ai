import os
import time
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in env variables!")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp') 
# Note: If 2.0-flash-exp isn't available in your region yet, use 'gemini-1.5-flash'

@app.get("/")
def read_root():
    return {"status": "Interview AI Backend is Running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    
    # Session history to keep the AI consistent
    chat_session = model.start_chat(history=[])
    
    # System Prompt to set the AI's behavior
    system_instruction = """
    You are a supportive coding interviewer. 
    The user is solving a coding problem and speaking out loud.
    The user has stopped speaking (silence detected), implying they are stuck.
    
    Based on their Code and their recent Speech:
    1. Give a SHORT, subtle hint. Do not give the answer.
    2. Guide them on their logic, not just syntax.
    3. Keep it under 2 sentences.
    4. If they seem to be doing well, just say "You're doing great, keep going."
    """

    try:
        while True:
            # Wait for data from frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            problem_statement = payload.get("problem", "")
            code_content = payload.get("code", "")
            transcript = payload.get("transcript", "")

            print(f"Analyzing silence... Transcript: {transcript}")

            # Construct the prompt for Gemini
            user_message = f"""
            System Instruction: {system_instruction}
            
            Current Problem: {problem_statement}
            User's Code So Far: 
            ```
            {code_content}
            ```
            User's Recent Speech (last few seconds): "{transcript}"
            """

            # Call Gemini
            # We use `generate_content` (stateless) or chat_session.send_message
            # Using chat session to remember previous hints
            response = chat_session.send_message(user_message)
            hint = response.text

            # Send back to frontend
            await websocket.send_json({"type": "hint", "message": hint})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
