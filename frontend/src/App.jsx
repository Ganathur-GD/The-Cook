import { useState, useEffect } from 'react'
import ChatMessages from './components/ChatMessages'
import InputBar from './components/InputBar'
import SearchResults from './components/SearchResults'
import { sendMessage, checkHealth, searchRecipes } from './api/geminiApi'

export default function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  // Resultados de búsqueda en blogs
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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

    // Lanzar búsqueda en blogs en paralelo con Gemini
    setIsSearching(true)
    setSearchQuery(text)
    setSearchResults(null)

    // Construir historial para la API (excluir el mensaje actual)
    const history = messages.map((m) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      content: m.content,
    }))

    // Peticiones en paralelo
    const [geminiResult, searchResult] = await Promise.allSettled([
      sendMessage(text, history),
      searchRecipes(text, 5),
    ])

    // Resultado de Gemini
    if (geminiResult.status === 'fulfilled') {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: geminiResult.value.reply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } else {
      const errMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content:
          '⚠️ Error al conectar con el backend. Asegúrate de que está en marcha y de que la GEMINI_API_KEY está configurada en backend/.env',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    }

    // Resultado de búsqueda
    if (searchResult.status === 'fulfilled') {
      setSearchResults(searchResult.value.results)
    } else {
      setSearchResults([])
    }

    setIsLoading(false)
    setIsSearching(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-icon">🍳</div>
        <div>
          <div className="header-title">The Cook</div>
          <div className="header-subtitle">Asistente de cocina con IA · gemini-1.5-flash</div>
        </div>
        <div className="header-status">
          <div className={`status-dot ${isOnline ? '' : 'offline'}`} />
          {isOnline ? 'Backend conectado' : 'Backend desconectado'}
        </div>
      </header>

      <main className="main-area">
        <div className="chat-column">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>

        {(isSearching || (searchResults && searchResults.length > 0)) && (
          <div className="search-column">
            <SearchResults
              results={searchResults}
              query={searchQuery}
              isLoading={isSearching}
            />
          </div>
        )}
      </main>

      <InputBar onSend={handleSend} disabled={isLoading || isSearching} />
    </div>
  )
}
