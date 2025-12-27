import os
import json
import io
import sys
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn

load_dotenv()

# Setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

# Force CORS to be wide open
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.get("/")
async def root():
    return {"status": "LIVE", "message": "The backend is working!"}

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
    return {"output": result}

# This part makes the file run itself
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
