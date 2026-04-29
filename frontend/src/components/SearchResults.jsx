/**
 * SearchResults — muestra las tarjetas de recetas encontradas
 * en blogs de cocina gracias a Google Custom Search API.
 */
export default function SearchResults({ results, query, isLoading }) {
  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-results-header">
          <span className="search-icon">🔍</span>
          Buscando recetas en blogs de cocina…
        </div>
        <div className="search-cards-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="search-card search-card-skeleton" />
          ))}
        </div>
      </div>
    )
  }

  if (!results || results.length === 0) return null

  return (
    <div className="search-results">
      <div className="search-results-header">
        <span className="search-icon">🔍</span>
        Recetas de la comunidad para&nbsp;<strong>"{query}"</strong>
        <span className="search-results-count">{results.length} resultados</span>
      </div>

      <div className="search-cards-grid">
        {results.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="search-card"
          >
            {item.thumbnail && (
              <div className="search-card-img-wrap">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="search-card-img"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
            <div className="search-card-body">
              <div className="search-card-source">{item.displayLink}</div>
              <div className="search-card-title">{item.title}</div>
              <p className="search-card-snippet">{item.snippet}</p>
            </div>
            <div className="search-card-arrow">↗</div>
          </a>
        ))}
      </div>
    </div>
  )
}
