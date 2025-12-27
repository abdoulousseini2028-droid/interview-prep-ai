import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, Terminal, Zap, Play } from 'lucide-react';

const BASE_URL = "https://musical-space-spork-4jpqwr54rw6ph7vx6-8000.app.github.dev";
const WS_URL = "wss://musical-space-spork-4jpqwr54rw6ph7vx6-8000.app.github.dev/ws/hints";

function App() {
  const [problem, setProblem] = useState("Two Sum: Find two numbers that add up to a target.");
  const [code, setCode] = useState("print('Hello World!')");
  const [output, setOutput] = useState("");
  const [hints, setHints] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [socket, setSocket] = useState(null);
  const [lastSpoken, setLastSpoken] = useState(Date.now());

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => console.log("✅ WebSocket Connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.hint) {
        setHints(prev => [{text: data.hint, time: new Date().toLocaleTimeString()}, ...prev]);
        const utterance = new SpeechSynthesisUtterance(data.hint);
        window.speechSynthesis.speak(utterance);
      }
    };
    ws.onerror = (err) => console.error("WebSocket Error:", err);
    setSocket(ws);

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        setLastSpoken(Date.now());
        const text = Array.from(event.results).map(r => r[0].transcript).join("");
        transcriptRef.current = text;
      };
      recognitionRef.current = recognition;
    }
    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isListening && (Date.now() - lastSpoken > 4000) && transcriptRef.current.trim().length > 5) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log("Sending to AI:", transcriptRef.current);
          socket.send(JSON.stringify({ 
            transcript: transcriptRef.current, 
            problem: problem,
            code: code 
          }));
          transcriptRef.current = ""; 
          setLastSpoken(Date.now());
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isListening, lastSpoken, socket, problem, code]);

  const handleRunCode = async () => {
    setOutput("Running...");
    try {
      const res = await fetch(`${BASE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setOutput(data.output || "No output returned.");
    } catch (err) {
      setOutput("Error: Backend unreachable. Make sure the backend terminal is running and you have visited the backend URL in a new tab.");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col gap-6 bg-gray-950">
        <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2 tracking-tight">
          <Terminal size={28} /> AI Coach
        </h1>
        
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Problem Statement</label>
          <textarea 
            className="w-full h-32 bg-gray-900 p-3 rounded-lg text-sm border border-gray-800 focus:border-blue-500 outline-none transition" 
            value={problem} 
            onChange={e => setProblem(e.target.value)} 
          />
        </div>

        <button 
          onClick={() => {
            if (isListening) {
              recognitionRef.current?.stop();
            } else {
              recognitionRef.current?.start();
            }
            setIsListening(!isListening);
          }} 
          className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg ${
            isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isListening ? <><MicOff size={24} /> Stop Coaching</> : <><Mic size={24} /> Start Voice Coach</>}
        </button>

        <div className="flex-1 overflow-y-auto pr-2">
          <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">Live AI Feedback</p>
          <div className="space-y-3">
            {hints.length === 0 && <p className="text-gray-700 italic text-sm text-center mt-10">Start speaking to get hints...</p>}
            {hints.map((h, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-xl border-l-4 border-blue-600 text-sm shadow-md animate-in fade-in slide-in-from-bottom-2">
                <p className="leading-relaxed">{h.text}</p>
                <span className="block text-[10px] text-gray-600 mt-2 font-mono uppercase">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400 font-mono ml-4 opacity-50">solution.py</span>
          </div>
          <button 
            onClick={handleRunCode} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm flex items-center gap-2 font-bold transition-all transform active:scale-95 shadow-md"
          >
            <Play size={16} fill="currentColor" /> RUN CODE
          </button>
        </div>
        
        <div className="flex-grow">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            defaultLanguage="python" 
            value={code} 
            onChange={setCode} 
            options={{ 
              fontSize: 16, 
              minimap: { enabled: false },
              padding: { top: 20 },
              cursorSmoothCaretAnimation: true
            }} 
          />
        </div>

        {/* OUTPUT CONSOLE */}
        <div className="h-1/3 bg-black border-t border-gray-800 p-6 font-mono text-sm overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Terminal Output</p>
            <button onClick={() => setOutput("")} className="text-gray-700 hover:text-gray-400 text-[10px] uppercase">Clear</button>
          </div>
          <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
            {output || "> Ready to execute..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
