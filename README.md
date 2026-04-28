# 🍳 The Cook - Generador de Recetas con IA

**The Cook** es una aplicación diseñada para esos momentos de indecisión culinaria en los que te apetece comer algo específico pero no quieres pasarte horas navegando por blogs de cocina interminables. 

Simplemente introduce un ingrediente que tengas a mano o que te apetezca comer, y nuestra IA generará una receta personalizada al instante.

## 🚀 El Proyecto

Este repositorio es un proyecto experimental para explorar la integración de modelos de lenguaje avanzados en aplicaciones web modernas.

### Tecnologías principales:
* **Frontend:** [React](https://reactjs.org/) con [Vite](https://vitejs.dev/) para una experiencia de usuario rápida y fluida.
* **Inteligencia Artificial:** [Google Gemini API](https://ai.google.dev/) para la generación dinámica y creativa de recetas.
* **Backend:** Python para la gestión segura de peticiones y lógica de negocio.

## 🛠️ Cómo funciona

1.  **Input:** El usuario introduce un ingrediente que desea comer.
2.  **Procesamiento:** El frontend envía la solicitud al backend, el cual consulta a la API de Gemini mediante un prompt optimizado.
3.  **Resultado:** La IA devuelve una receta coherente con ingredientes y pasos, que se renderiza inmediatamente en la pantalla.

## ⚙️ Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    ```

2.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la carpeta `backend/` basado en `.env.example` y añade tu `GEMINI_API_KEY`.

3.  **Instalar dependencias:**
    * **Backend:** `pip install -r backend/requirements.txt`
    * **Frontend:** `cd frontend && npm install`

---
*Proyecto desarrollado con fines educativos y de experimentación con IAs generativas.*
