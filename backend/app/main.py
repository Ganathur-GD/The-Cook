from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import gemini, search

app = FastAPI(
    title="The Cook API",
    description="Backend API con integración de Google Gemini",
    version="1.0.0",
)

# CORS para el frontend de React en Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gemini.router, prefix="/api")
app.include_router(search.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "message": "The Cook API está funcionando 🍳"}

app = app