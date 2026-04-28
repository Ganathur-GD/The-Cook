import { useState, useEffect } from 'react'
import ChatMessages from './components/ChatMessages'
import InputBar from './components/InputBar'
import { sendMessage, checkHealth } from './api/geminiApi'

export default function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  // Comprobar estado del backend al montar
  useEffect(() => {
    checkHealth()
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false))
  }, [])

  const handleSend = async (text) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Construir historial para la API (excluir el mensaje actual)
    const history = messages.map((m) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      content: m.content,
    }))

    try {
      const { reply } = await sendMessage(text, history)
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: reply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: '⚠️ Error al conectar con el backend. Asegúrate de que está en marcha y de que la GEMINI_API_KEY está configurada en backend/.env',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-icon">🍳</div>
        <div>
          <div className="header-title">The Cook</div>
          <div className="header-subtitle">Asistente de cocina con IA · gemini-2.5-flash</div>
        </div>
        <div className="header-status">
          <div className={`status-dot ${isOnline ? '' : 'offline'}`} />
          {isOnline ? 'Backend conectado' : 'Backend desconectado'}
        </div>
      </header>

      <main>
        <ChatMessages messages={messages} isLoading={isLoading} />
      </main>

      <InputBar onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
