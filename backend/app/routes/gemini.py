from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    reply: str
    model: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Envía un mensaje a Gemini y devuelve la respuesta.
    """
    try:
        reply = await gemini_service.send_message(request.message, request.history)
        return ChatResponse(reply=reply, model="gemini-2.5-flash")
    except Exception as e:
        error_msg = str(e)
        # Devuelve 429 si es un error de cuota/rate limit para que el frontend lo maneje bien
        if "cuota gratuita" in error_msg or "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise HTTPException(status_code=429, detail=error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@router.get("/health")
async def health():
    return {"status": "ok", "gemini_configured": gemini_service.is_configured()}
