import { useRef, useEffect } from 'react'

export default function MessageBubble({ message }) {
  const { role, content, timestamp } = message

  const time = new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`message ${role}`}>
      <div className="message-avatar">
        {role === 'user' ? '👤' : '🍳'}
      </div>
      <div className="message-content">
        <div className="message-bubble">{content}</div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  )
}
