import { useState, useRef } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleInput = (e) => {
    setValue(e.target.value)
    // Auto-resize
    const ta = textareaRef.current
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="input-area">
      <div className="input-bar">
        <textarea
          ref={textareaRef}
          id="chat-input"
          className="input-textarea"
          rows={1}
          placeholder="Pregunta una receta, técnica o ingredientes..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          id="send-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Enviar mensaje"
        >
          ➤
        </button>
      </div>
      <p className="input-hint">Enter para enviar · Shift+Enter para nueva línea</p>
    </div>
  )
}
