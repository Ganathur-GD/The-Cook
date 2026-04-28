# 🍳 The Cook — Asistente de Cocina con IA

Aplicación web full-stack con **React + Vite** (frontend) y **FastAPI** (backend), integrada con la API de **Google Gemini 2.5 Flash**.

## Estructura

```
The Cook/
├── frontend/          # React + Vite (puerto 5173)
│   └── src/
│       ├── api/       # Cliente Axios hacia el backend
│       ├── components/ # ChatMessages, MessageBubble, InputBar
│       ├── App.jsx
│       └── index.css
│
└── backend/           # FastAPI (puerto 8000)
    ├── app/
    │   ├── main.py
    │   ├── routes/gemini.py
    │   └── services/gemini_service.py
    ├── .env           # ← Añade tu API Key aquí
    └── requirements.txt
```

## Configuración

### 1. API Key de Gemini

Crea el archivo `backend/.env` copiando el ejemplo:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y añade tu clave:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

Obtén tu key en [Google AI Studio](https://aistudio.google.com/app/apikey).

## Ejecución

### Backend (terminal 1)

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

El backend arranca en → `http://localhost:8000`  
Documentación automática → `http://localhost:8000/docs`

### Frontend (terminal 2)

```powershell
cd frontend
npm run dev
```

La app arranca en → `http://localhost:5173`

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/chat` | Envía mensaje a Gemini |
| `GET`  | `/api/health` | Estado del backend |
| `GET`  | `/` | Health check raíz |
