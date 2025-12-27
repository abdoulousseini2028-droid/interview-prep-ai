import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, Terminal, Zap, Play } from 'lucide-react';

// UPDATE THESE with your Codespace URLs from the Ports tab
const BASE_URL = "https://your-codespace-name-8000.app.github.dev";
const WS_URL = "wss://your-codespace-name-8000.app.github.dev/ws/hints";

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

  // 1. Initialize WebSocket & Speech
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.hint) {
        setHints(prev => [{text: data.hint, time: new Date().toLocaleTimeString()}, ...prev]);
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.hint));
      }
    };
    setSocket(ws);

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        setLastSpoken(Date.now());
        transcriptRef.current = Array.from(event.results).map(r => r[0].transcript).join("");
      };
      recognitionRef.current = recognition;
    }
    return () => ws.close();
  }, []);

  // 2. Silence Detection (Trigger AI)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isListening && (Date.now() - lastSpoken > 4000) && transcriptRef.current.length > 2) {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(json.stringify({ transcript: transcriptRef.current, problem }));
          transcriptRef.current = ""; 
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isListening, lastSpoken, socket, problem]);

  // 3. Run Code function
  const handleRunCode = async () => {
    setOutput("Running...");
    try {
      const res = await fetch(`${BASE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setOutput(data.output);
    } catch {
      setOutput("Error: Backend unreachable.");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r border-gray-800 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-blue-500 flex items-center gap-2"><Terminal /> InterviewPrep</h1>
        <textarea className="w-full h-32 bg-gray-900 p-2 rounded text-sm" value={problem} onChange={e => setProblem(e.target.value)} />
        
        <button onClick={() => {
          if (isListening) recognitionRef.current.stop();
          else recognitionRef.current.start();
          setIsListening(!isListening);
        }} className={`p-3 rounded flex items-center justify-center gap-2 ${isListening ? 'bg-red-600' : 'bg-green-600'}`}>
          {isListening ? <><MicOff /> Stop Coach</> : <><Mic /> Start Coach</>}
        </button>

        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-2 font-bold">AI HINTS</p>
          {hints.map((h, i) => (
            <div key={i} className="bg-gray-900 p-2 rounded mb-2 border-l-2 border-blue-500 text-sm">
              {h.text} <span className="block text-[10px] text-gray-600">{h.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor & Console */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 p-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">main.py</span>
          <button onClick={handleRunCode} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1 font-bold">
            <Play size={14} /> Run
          </button>
        </div>
        <div className="flex-grow">
          <Editor height="100%" theme="vs-dark" defaultLanguage="python" value={code} onChange={setCode} />
        </div>
        <div className="h-1/3 bg-black border-t border-gray-800 p-4 font-mono text-sm overflow-y-auto">
          <p className="text-gray-500 text-xs mb-2">OUTPUT</p>
          <pre className="text-green-400">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
