import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, Terminal, Zap } from 'lucide-react';

const WS_URL = 'ws://localhost:8000/ws'; // Change for production

function App() {
  // State
  const [socket, setSocket] = useState(null);
  const [problem, setProblem] = useState("Two Sum: Find two numbers in the array that add up to target.");
  const [code, setCode] = useState("// Write your solution here...");
  const [hints, setHints] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [lastSpokenTime, setLastSpokenTime] = useState(Date.now());
  const [transcriptBuffer, setTranscriptBuffer] = useState("");
  
  // Refs for silence detection logic
  const silenceTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // To access current transcript inside intervals

  // 1. Initialize WebSocket
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log('Connected to AI Backend');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'hint') {
        const newHint = { id: Date.now(), text: data.message, time: new Date().toLocaleTimeString() };
        setHints(prev => [newHint, ...prev]);
        
        // Optional: Speak the hint out loud (Text-to-Speech)
        const speech = new SpeechSynthesisUtterance(data.message);
        window.speechSynthesis.speak(speech);
      }
    };
    
    setSocket(ws);
    return () => ws.close();
  }, []);

  // 2. Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser not supported. Use Chrome.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      // User is speaking, update timestamp and buffer
      setLastSpokenTime(Date.now());
      
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcriptRef.current += " " + event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscriptBuffer(interimTranscript);
    };

    recognition.onerror = (event) => console.error("Speech error", event.error);
    
    recognitionRef.current = recognition;
  }, []);

  // 3. Silence Detection Loop
  useEffect(() => {
    if (isListening) {
      silenceTimerRef.current = setInterval(() => {
        const timeSinceLastWord = Date.now() - lastSpokenTime;
        
        // If silence > 4 seconds AND we have said something recently
        if (timeSinceLastWord > 4000 && transcriptRef.current.length > 5) {
          console.log("Silence detected. Asking AI for help...");
          
          // Trigger AI
          triggerAI();
          
          // Reset buffer so we don't send old text repeatedly
          transcriptRef.current = ""; 
          setLastSpokenTime(Date.now()); // Reset timer to avoid double triggering
        }
      }, 1000);
    } else {
      clearInterval(silenceTimerRef.current);
    }
    
    return () => clearInterval(silenceTimerRef.current);
  }, [isListening, lastSpokenTime, socket]);

  const triggerAI = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const payload = {
        problem: problem,
        code: code,
        transcript: transcriptRef.current
      };
      socket.send(JSON.stringify(payload));
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
      transcriptRef.current = ""; 
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* LEFT PANEL: Problem & Controls */}
      <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
          <Terminal size={24} /> InterviewPrep.AI
        </h1>
        
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Problem Statement</label>
          <textarea 
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-6">
          <div>
            <p className="text-sm font-semibold">Voice Coach</p>
            <p className="text-xs text-gray-400">
              {isListening ? "Listening for silence..." : "Microphone off"}
            </p>
          </div>
          <button 
            onClick={toggleMic}
            className={`p-3 rounded-full transition-all ${
              isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Zap size={16} /> Live AI Hints
          </h3>
          <div className="space-y-3">
            {hints.length === 0 && (
              <p className="text-gray-600 text-sm italic">Start speaking. When you get stuck (silence), I will help.</p>
            )}
            {hints.map((hint) => (
              <div key={hint.id} className="bg-gray-800 border-l-4 border-blue-500 p-3 rounded text-sm animate-fade-in">
                <p className="mb-1">{hint.text}</p>
                <span className="text-xs text-gray-500">{hint.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Code Editor */}
      <div className="w-2/3 bg-gray-950">
        <Editor
          height="100vh"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            padding: { top: 20 }
          }}
        />
      </div>
    </div>
  );
}

export default App;
