import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, Terminal, Play, MessageSquare, User } from 'lucide-react';

const BASE_URL = "https://musical-space-spork-4jpqwr54rw6ph7vx6-8000.app.github.dev";
const WS_URL = "wss://musical-space-spork-4jpqwr54rw6ph7vx6-8000.app.github.dev/ws/hints";

function App() {
  const [problem, setProblem] = useState("Paste your coding problem here...");
  const [code, setCode] = useState("# Write your Python code here\nprint('Hello World!')");
  const [output, setOutput] = useState("");
  const [hints, setHints] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState(""); // Visual proof of speaking
  const [socket, setSocket] = useState(null);
  const [lastSpoken, setLastSpoken] = useState(Date.now());

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  // Setup WebSocket and Speech Recognition
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.hint) {
        setHints(prev => [{text: data.hint, time: new Date().toLocaleTimeString()}, ...prev]);
        // VOICE SUGGESTION
        const utterance = new SpeechSynthesisUtterance(data.hint);
        window.speechSynthesis.speak(utterance);
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
        const current = Array.from(event.results).map(r => r[0].transcript).join("");
        setLiveTranscript(current); // Shows user their words
        transcriptRef.current = current;
      };
      recognitionRef.current = recognition;
    }
  }, []);

  // SMART PROBLEM RECOGNITION (Voice Welcome)
  const handleProblemBlur = () => {
    if (problem.length > 10) {
      const msg = `Got it. I'll help you prepare for the ${problem.substring(0, 30)} challenge. Let me know your thought process.`;
      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(utterance);
    }
  };

  // AI Logic: Send to backend after 12 seconds of silence
  useEffect(() => {
    const interval = setInterval(() => {
      if (isListening && (Date.now() - lastSpoken > 12000) && transcriptRef.current.trim().length > 5) {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ 
            transcript: transcriptRef.current, 
            problem: problem,
            code: code 
          }));
          transcriptRef.current = ""; 
          setLiveTranscript("");
          setLastSpoken(Date.now());
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isListening, lastSpoken, socket, problem, code]);

  const handleRunCode = async () => {
    setOutput("Processing output...");
    try {
      const res = await fetch(`${BASE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setOutput(data.output || "Code executed (no output).");
    } catch (err) {
      setOutput("Error: Backend unreachable. Ensure the -8000 link is 'Authorized'.");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col gap-4 bg-gray-950">
        <h1 className="text-xl font-bold text-blue-500 flex items-center gap-2 tracking-tight">
          <Terminal size={24} /> AI Interview Coach
        </h1>
        
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Problem Statement</label>
          <textarea 
            className="w-full h-24 bg-gray-900 p-3 rounded-lg text-sm border border-gray-800 focus:border-blue-500 outline-none" 
            value={problem} 
            onChange={e => setProblem(e.target.value)}
            onBlur={handleProblemBlur}
            placeholder="Type your problem here..."
          />
        </div>

        <button 
          onClick={() => {
            if (isListening) recognitionRef.current?.stop();
            else recognitionRef.current?.start();
            setIsListening(!isListening);
          }} 
          className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
            isListening ? 'bg-red-600 animate-pulse' : 'bg-green-600'
          }`}
        >
          {isListening ? <><MicOff /> Stop Session</> : <><Mic /> Start Voice Coach</>}
        </button>

        {/* LIVE TRANSCRIPT (Proof of speaking) */}
        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30 min-h-[60px]">
           <p className="text-[10px] text-blue-400 uppercase font-bold mb-1 flex items-center gap-1"><User size={10}/> Live Transcript</p>
           <p className="text-xs text-blue-100 italic">{liveTranscript || (isListening ? "Waiting for you to speak..." : "Mic is off")}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">AI Feedback History</p>
          <div className="space-y-2">
            {hints.map((h, i) => (
              <div key={i} className="bg-gray-900 p-3 rounded-lg border-l-2 border-blue-600 text-xs shadow-md animate-in fade-in slide-in-from-bottom-2">
                {h.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800">
          <span className="text-xs text-gray-400 font-mono">solution.py</span>
          <button 
            onClick={handleRunCode} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-1.5 rounded-lg text-sm flex items-center gap-2 font-bold transition-all active:scale-95"
          >
            <Play size={14} fill="currentColor" /> RUN CODE
          </button>
        </div>
        
        <div className="flex-grow">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            defaultLanguage="python" 
            value={code} 
            onChange={setCode} 
            options={{ fontSize: 16, minimap: { enabled: false } }} 
          />
        </div>

        <div className="h-1/3 bg-black border-t border-gray-800 p-4 font-mono text-sm overflow-y-auto">
          <p className="text-gray-500 text-[10px] font-bold uppercase mb-2">Terminal Output</p>
          <pre className="text-green-400 whitespace-pre-wrap">{output || "> Click 'Run Code' to see results..."}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
