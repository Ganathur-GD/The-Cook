import { useState, useEffect } from 'react'
import ChatMessages from './components/ChatMessages'
import InputBar from './components/InputBar'
import SearchResults from './components/SearchResults'
import { sendMessage, checkHealth, searchRecipes } from './api/geminiApi'

export default function App() {
  const [activeTab, setActiveTab] = useState('nueva') // 'nueva', 'comunidad', 'historial'

  // Gemini state
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('cook_messages')
    return saved ? JSON.parse(saved) : []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  // Search state
  const [searchResults, setSearchResults] = useState(() => {
    const saved = localStorage.getItem('cook_search_results')
    return saved ? JSON.parse(saved) : null
  })
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('cook_search_query') || ''
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(() => {
    return localStorage.getItem('cook_has_searched') === 'true'
  })

  // Persist history on change
  useEffect(() => {
    localStorage.setItem('cook_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('cook_search_results', JSON.stringify(searchResults))
    localStorage.setItem('cook_search_query', searchQuery)
    localStorage.setItem('cook_has_searched', hasSearched)
  }, [searchResults, searchQuery, hasSearched])

  // Comprobar estado del backend al montar
  useEffect(() => {
    checkHealth()
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false))
  }, [])

  const handleSend = async (text) => {
    if (activeTab === 'nueva') {
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const history = messages.map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content,
      }))

      try {
        const geminiResult = await sendMessage(text, history)
        const aiMsg = {
          id: Date.now() + 1,
          role: 'ai',
          content: geminiResult.reply,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch (err) {
        const errMsg = {
          id: Date.now() + 1,
          role: 'ai',
          content:
            '⚠️ Error al conectar con el backend. Asegúrate de que está en marcha y de que la GEMINI_API_KEY está configurada en backend/.env',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errMsg])
      }
      setIsLoading(false)
    } else if (activeTab === 'comunidad') {
      setIsSearching(true)
      setSearchQuery(text)
      setHasSearched(true)
      setSearchResults(null)

      try {
        const searchResult = await searchRecipes(text, 5)
        setSearchResults(searchResult.results)
      } catch (err) {
        setSearchResults([])
      }
      setIsSearching(false)
    }
  }

  const showWelcome =
    (activeTab === 'nueva' && messages.length === 0) ||
    (activeTab === 'comunidad' && !hasSearched)

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

      <div className="app-layout">
        <aside className="sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'nueva' ? 'active' : ''}`}
            onClick={() => setActiveTab('nueva')}
          >
            <span style={{ fontSize: '18px' }}>🍳</span> Nueva receta
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'comunidad' ? 'active' : ''}`}
            onClick={() => setActiveTab('comunidad')}
          >
            <span style={{ fontSize: '18px' }}>🔍</span> Recetas de la comunidad
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            <span style={{ fontSize: '18px' }}>🕒</span> Historial
          </button>
        </aside>

        <div className="content-area">
          {activeTab === 'historial' ? (
            <div className="messages-container" style={{ padding: '24px 0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                Historial Guardado
              </h2>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '16px', fontSize: '16px' }}>
                    🍳 Recetas Creadas (Gemini)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.filter((m) => m.role === 'ai').length === 0 ? (
                      <div style={{ color: 'var(--text-muted)' }}>
                        No hay recetas creadas aún.
                      </div>
                    ) : (
                      messages
                        .filter((m) => m.role === 'ai')
                        .slice()
                        .reverse()
                        .map((m, i) => (
                          <div key={i} className="message ai">
                            <div className="message-content">
                              <div className="message-bubble" style={{ fontSize: '13px' }}>
                                {m.content.length > 200
                                  ? m.content.substring(0, 200) + '...'
                                  : m.content}
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '16px', fontSize: '16px' }}>
                    🔍 Última Búsqueda en la Comunidad
                  </h3>
                  {hasSearched && searchResults && searchResults.length > 0 ? (
                    <SearchResults
                      results={searchResults}
                      query={searchQuery}
                      isLoading={false}
                    />
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      No hay búsquedas guardadas o resultados encontrados.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : showWelcome ? (
            <div className="welcome-screen">
              <h1 className="welcome-title">¿Qué te apetece comer hoy?</h1>
              <div className="welcome-input-wrapper">
                <InputBar onSend={handleSend} disabled={isLoading || isSearching} />
              </div>
            </div>
          ) : (
            <>
              <div className="main-area" style={{ paddingBottom: '16px' }}>
                {activeTab === 'nueva' && (
                  <div className="chat-column">
                    <ChatMessages messages={messages} isLoading={isLoading} />
                  </div>
                )}
                {activeTab === 'comunidad' && (
                  <div className="search-column" style={{ width: '100%', padding: '0 8px' }}>
                    {searchResults && searchResults.length === 0 ? (
                      <div className="messages-empty" style={{ paddingTop: '60px' }}>
                        <div className="messages-empty-icon">🍽️</div>
                        <h2>No se encuentran recetas</h2>
                        <p>Prueba con otros ingredientes o términos de búsqueda más generales.</p>
                      </div>
                    ) : (
                      <SearchResults
                        results={searchResults}
                        query={searchQuery}
                        isLoading={isSearching}
                      />
                    )}
                  </div>
                )}
              </div>
              <InputBar onSend={handleSend} disabled={isLoading || isSearching} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
