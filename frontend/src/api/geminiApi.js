import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Envía un mensaje a Gemini con el historial de conversación.
 * @param {string} message
 * @param {Array<{role: string, content: string}>} history
 * @returns {Promise<{reply: string, model: string}>}
 */
export async function sendMessage(message, history = []) {
  const { data } = await api.post('/chat', { message, history })
  return data
}

/**
 * Busca recetas en blogs de cocina usando la Custom Search API.
 * @param {string} query
 * @param {number} num - Número de resultados (1-10)
 * @returns {Promise<{query: string, results: Array, total: number}>}
 */
export async function searchRecipes(query, num = 5) {
  const { data } = await api.get('/search', { params: { q: query, num } })
  return data
}

/**
 * Comprueba el estado del backend y si Gemini está configurado.
 */
export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}
