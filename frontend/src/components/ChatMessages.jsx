import { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatMessages({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="messages-container">
        <div className="messages-empty">
          <div className="messages-empty-icon">🍳</div>
          <h2>¡Hola! Soy The Cook</h2>
          <p>Tu asistente de cocina con IA. Pregúntame recetas, técnicas o ideas para tus platos.</p>
          <div className="suggestions">
            {[
              '¿Qué puedo cocinar con pollo y limón?',
              'Dame una receta fácil para cenar',
              '¿Cómo se hace el risotto?',
              'Ideas para una cena romántica',
            ].map((s) => (
              <span key={s} className="suggestion-chip">{s}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="message ai">
          <div className="message-avatar">🍳</div>
          <div className="message-content">
            <div className="message-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
