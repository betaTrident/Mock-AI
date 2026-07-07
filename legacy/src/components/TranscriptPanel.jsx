import { useEffect, useRef } from 'react'
import { Bot, User, Loader2 } from 'lucide-react'

export default function TranscriptPanel({ messages, isAISpeaking, isProcessing, interimTranscript }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, interimTranscript])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Live Transcript</h3>
        <p className="text-xs text-gray-500 mt-0.5">Real-time conversation</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isAISpeaking && (
          <div className="text-center text-gray-400 text-sm py-8">
            <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Waiting for interview to begin...</p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={message.id || index} message={message} />
        ))}

        {/* AI Typing Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Interim Transcript (while user is speaking) */}
        {interimTranscript && (
          <div className="flex items-start gap-2 justify-end">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm text-gray-500 italic">{interimTranscript}</p>
            </div>
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        {isAISpeaking && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI is speaking...</span>
          </div>
        )}
        {!isAISpeaking && !isProcessing && interimTranscript && (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Listening...</span>
          </div>
        )}
        {!isAISpeaking && !isProcessing && !interimTranscript && (
          <div className="text-xs text-gray-400">
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isInterviewer = message.role === 'interviewer'

  return (
    <div className={`flex items-start gap-2 ${!isInterviewer ? 'justify-end' : ''}`}>
      {isInterviewer && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-600" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isInterviewer ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isInterviewer 
            ? 'bg-gray-100 text-gray-900 rounded-tl-sm' 
            : 'bg-blue-600 text-white rounded-tr-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {!isInterviewer && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center order-2">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )
}
