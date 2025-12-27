import os
import json
import io
import sys
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai  # Use the new library
from dotenv import load_dotenv
import uvicorn

load_dotenv()

# Setup New Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Wide open CORS to fix the "Load Failed" error
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
    return {"status": "LIVE", "message": "Backend is active!"}

@app.post("/run")
async def execute_code(request: CodeRequest):
    output_capture = io.StringIO()
    sys.stdout = output_capture
    try:
        exec(request.code, {"__builtins__": __builtins__}, {})
        result = output_capture.getvalue()
    except Exception as e:
        result = str(e)
    finally:
        sys.stdout = sys.__stdout__
    return {"output": result if result.strip() else "Executed successfully (no print output)."}

@app.websocket("/ws/hints")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=f"Hint for: {payload.get('problem')}. Said: {payload.get('transcript')}. 1 sentence hint."
            )
            await websocket.send_json({"hint": response.text})
    except:
        pass

# THIS PART KEEPS THE SERVER RUNNING
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
