import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ChatBot.css'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

// Fallback to the live production URL if the environment variable is missing
const API_BASE = import.meta.env.VITE_RAG_API_URL || 'https://vedavyas1235-american-dream-mall-chatbot.hf.space'

async function queryRAG(question: string): Promise<string> {
  console.log(`Querying RAG at: ${API_BASE}/ask`);
  try {
    const res = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify({ question }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('RAG Error details:', errText)
      throw new Error(`Server responded with ${res.status}`)
    }

    const data = await res.json()
    return data.answer || "I'm sorry, I couldn't find a specific answer to that. Could you try rephrasing?"
  } catch (error: any) {
    console.error('Fetch error:', error)
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Connection failed. This might be a CORS issue or the server is down.')
    }
    throw error
  }
}

export default function ChatBot({
  isLastSlide,
  isOpen: externalOpen,
  onToggle,
}: {
  isLastSlide: boolean
  isOpen?: boolean
  onToggle?: () => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Use external control if provided, otherwise internal
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const desired = typeof val === 'function' ? val(open) : val
    if (onToggle) {
      // Only toggle if the desired state is different from current
      if (desired !== open) onToggle()
    } else {
      setInternalOpen(desired)
    }
  }
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hi! I'm the American Dream AI assistant. Ask me anything about leasing, events, partnerships, or venue bookings.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-close when navigating away — only applies in internal (non-external) mode
  // In persona/external mode, the parent (DeckNav) controls open state
  useEffect(() => {
    if (!isLastSlide && !onToggle) setInternalOpen(false)
  }, [isLastSlide, onToggle])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const reply = await queryRAG(text)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "Sorry, I couldn't reach the backend right now. Please ensure the RAG server is running and try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Never return null — the panel must always be mountable so external triggers work.
  // Only the topbar trigger button is hidden when isLastSlide is false.

  return (
    <>
      {/* Topbar trigger — only visible on designated slides (linear deck) */}
      {isLastSlide && (
        <motion.button
          className="chatbot-topbar-btn"
          onClick={() => setOpen(o => !o)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          aria-label="Open AI assistant"
          title="Ask our AI assistant"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Ask AI</span>
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="chatbot-panel__header">
              <div className="chatbot-panel__title">
                <span className="chatbot-panel__dot" />
                American Dream AI
              </div>
              <button
                className="chatbot-panel__close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-panel__messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <span className="chatbot-msg__avatar">✦</span>
                  )}
                  <p className="chatbot-msg__text">{msg.text}</p>
                </div>
              ))}

              {loading && (
                <div className="chatbot-msg chatbot-msg--assistant">
                  <span className="chatbot-msg__avatar">✦</span>
                  <p className="chatbot-msg__text chatbot-msg--typing">
                    <span /><span /><span />
                  </p>
                </div>
              )}

              {error && (
                <p className="chatbot-error">{error}</p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="chatbot-panel__input-row">
              <textarea
                className="chatbot-panel__input"
                placeholder="Ask about venues, leasing, events…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                className="chatbot-panel__send"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
