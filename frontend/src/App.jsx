import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, Terminal, Zap } from 'lucide-react';

const WS_URL = 'ws://localhost:8000/ws/hints';

function App() {
  const [socket, setSocket] = useState(null);
  const [problem, setProblem] = useState("Two Sum: Find two numbers in an array that add up to a target.");
  const [code, setCode] = useState("// Type your code here...");
  const [hints, setHints] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [lastSpokenTime, setLastSpokenTime] = useState(Date.now());
  
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); 
  const silenceTimerRef = useRef(null);

  // 1. WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => console.log('✅ Connected to Gemini Backend');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.hint) {
        const newHint = { id: Date.now(), text: data.hint, time: new Date().toLocaleTimeString() };
        setHints(prev => [newHint, ...prev]);
        
        // Text-to-Speech: The AI speaks the hint
        const utterance = new SpeechSynthesisUtterance(data.hint);
        window.speechSynthesis.speak(utterance);
      }
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  // 2. Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      setLastSpokenTime(Date.now()); // Reset silence clock
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      transcriptRef.current = currentTranscript;
    };

    recognitionRef.current = recognition;
  }, []);

  // 3. Silence Detection Logic (The "Trigger")
  useEffect(() => {
    if (isListening) {
      silenceTimerRef.current = setInterval(() => {
        const silenceDuration = Date.now() - lastSpokenTime;
        // If silent for 4 seconds and user has actually said something
        if (silenceDuration > 4000 && transcriptRef.current.trim().length > 0) {
          sendToAI();
          transcriptRef.current = ""; // Clear transcript after sending
          setLastSpokenTime(Date.now()); // Reset timer
        }
      }, 1000);
    } else {
      clearInterval(silenceTimerRef.current);
    }
    return () => clearInterval(silenceTimerRef.current);
  }, [isListening, lastSpokenTime]);

  const sendToAI = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        problem: problem,
        code: code,
        transcript: transcriptRef.current
      }));
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setLastSpokenTime(Date.now());
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col">
        <h1 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
          <Terminal size={20} /> Interview AI
        </h1>
        
        <textarea 
          className="w-full h-32 bg-gray-800 p-3 rounded mb-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <button 
          onClick={toggleMic}
          className={`w-full p-4 rounded-lg mb-6 flex items-center justify-center gap-2 font-bold transition ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isListening ? <><MicOff size={20} /> Stop Coaching</> : <><Mic size={20} /> Start Voice Coach</>}
        </button>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xs font-uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <Zap size={14} /> LIVE HINTS
          </h2>
          <div className="space-y-4">
            {hints.map(h => (
              <div key={h.id} className="bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm">{h.text}</p>
                <span className="text-[10px] text-gray-500">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="w-2/3">
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v)}
          options={{ fontSize: 16, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}

export default App;
