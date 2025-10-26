import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Send, Code, MessageSquare, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const WS_URL = 'ws://localhost:8000/ws'
console.log('WS_URL is:', WS_URL)

function App() {
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [ws, setWs] = useState(null)
  const [connected, setConnected] = useState(false)
  const [stage, setStage] = useState('problem') // problem, approach, coding, feedback
  const [problem, setProblem] = useState('')
  const [approach, setApproach] = useState('')
  const [code, setCode] = useState('# Write your solution here\n\n')
  const [language, setLanguage] = useState('python')
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket(`${WS_URL}/${sessionId}`)
    
    websocket.onopen = () => {
      console.log('Connected to AI Interview Coach')
      setConnected(true)
    }
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Received:', data)
      
      setLoading(false)
      
      if (data.type === 'system' || data.type === 'ai_response') {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: data.message,
          timestamp: data.timestamp
        }])
      } else if (data.type === 'code_analysis') {
        setAnalysis(data.analysis)
        setStage('feedback')
        setMessages(prev => [...prev, {
          type: 'analysis',
          content: data.analysis,
          timestamp: data.timestamp
        }])
      } else if (data.type === 'session_summary') {
        setMessages(prev => [...prev, {
          type: 'summary',
          content: data.summary,
          timestamp: data.timestamp
        }])
      } else if (data.type === 'error') {
        setMessages(prev => [...prev, {
          type: 'error',
          content: data.message,
          timestamp: data.timestamp
        }])
      }
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }
    
    websocket.onclose = () => {
      console.log('Disconnected from AI Interview Coach')
      setConnected(false)
    }
    
    setWs(websocket)
    
    return () => {
      websocket.close()
    }
  }, [sessionId])

  const sendMessage = (type, content) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, content }))
      setLoading(true)
    }
  }

  const handleProblemSubmit = () => {
    if (!problem.trim()) return
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: `Problem: ${problem}`,
      timestamp: new Date().toISOString()
    }])
    
    sendMessage('problem_description', problem)
    setStage('approach')
  }

  const handleApproachSubmit = () => {
    if (!approach.trim()) return
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: `My approach: ${approach}`,
      timestamp: new Date().toISOString()
    }])
    
    sendMessage('explanation', approach)
    setStage('coding')
  }

  const handleCodeSubmit = () => {
    if (!code.trim() || code.trim() === '# Write your solution here') {
      alert('Please write some code first!')
      return
    }
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: 'Submitted code for review',
      timestamp: new Date().toISOString()
    }])
    
    sendMessage('code_submission', { code, language })
  }

  const handleChatMessage = () => {
    if (!currentMessage.trim()) return
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }])
    
    sendMessage('message', currentMessage)
    setCurrentMessage('')
  }

  const handleEndSession = () => {
    sendMessage('end_session', {})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Prep</h1>
              <p className="text-sm text-gray-500">Real-time feedback on code & communication</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        {/* Left Panel - Problem & Code Editor */}
        <div className="flex flex-col gap-4">
          {/* Problem Input */}
          {stage === 'problem' && (
            <div className="card flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Describe Your Problem
              </h2>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Example: Write a function that finds the two numbers in an array that sum to a target value..."
                className="input flex-1 resize-none font-mono text-sm"
              />
              <button 
                onClick={handleProblemSubmit}
                disabled={!problem.trim()}
                className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Interview
              </button>
            </div>
          )}

          {/* Approach Input */}
          {stage === 'approach' && (
            <div className="card flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Explain Your Approach</h2>
              <textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Explain your strategy before coding..."
                className="input flex-1 resize-none"
              />
              <button 
                onClick={handleApproachSubmit}
                disabled={!approach.trim()}
                className="btn-primary mt-4 disabled:opacity-50"
              >
                Continue to Coding
              </button>
            </div>
          )}

          {/* Code Editor */}
          {(stage === 'coding' || stage === 'feedback') && (
            <div className="card flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code Editor
                </h2>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage={language}
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <button 
                onClick={handleCodeSubmit}
                disabled={loading}
                className="btn-primary mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Submit for Review</>
                )}
              </button>
            </div>
          )}

          {/* Feedback Display */}
          {analysis && stage === 'feedback' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Code Analysis</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Score: {analysis.score}/10
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${analysis.score * 10}%` }}
                    />
                  </div>
                </div>

                {analysis.technical_feedback && (
                  <div>
                    <h3 className="font-semibold mb-1">Technical Feedback:</h3>
                    <p className="text-sm text-gray-700">{analysis.technical_feedback}</p>
                  </div>
                )}

                {analysis.complexity_analysis && (
                  <div>
                    <h3 className="font-semibold mb-1">Complexity Analysis:</h3>
                    <p className="text-sm text-gray-700">{analysis.complexity_analysis}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleEndSession}
                className="btn-secondary mt-4 w-full"
              >
                End Session & Get Summary
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - AI Chat */}
        <div className="card flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Interview Coach
          </h2>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user' 
                    ? 'bg-primary text-white' 
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-900'
                    : msg.type === 'analysis'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.type === 'analysis' ? (
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-2">✅ Code Analyzed!</p>
                      <p className="text-gray-700">Check the feedback panel on the left</p>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              placeholder="Ask questions or discuss your solution..."
              className="input"
              disabled={stage === 'problem'}
            />
            <button 
              onClick={handleChatMessage}
              disabled={!currentMessage.trim() || stage === 'problem'}
              className="btn-primary disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
