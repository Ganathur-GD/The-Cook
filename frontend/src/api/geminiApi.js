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
 * Comprueba el estado del backend y si Gemini está configurado.
 */
export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}
