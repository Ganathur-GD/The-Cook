import os
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Carga el .env desde la raíz del backend independientemente del CWD
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = "gemini-2.5-flash"
        self.client = None

        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)

    def is_configured(self) -> bool:
        return self.api_key is not None and self.api_key != ""

    async def send_message(self, message: str, history: list[dict] = []) -> str:
        if not self.is_configured():
            raise Exception(
                "GEMINI_API_KEY no configurada. Añádela al archivo .env del backend."
            )

        # Construir el historial en el formato que espera el nuevo SDK
        contents = []
        for entry in history:
            role = entry.get("role", "user")
            # El nuevo SDK solo acepta "user" y "model" como roles
            if role == "assistant":
                role = "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=entry.get("content", ""))],
                )
            )

        # Añadir el mensaje actual del usuario
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=message)],
            )
        )

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=contents,
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                raise Exception(
                    "Se ha superado el límite de solicitudes de la API de Gemini (cuota gratuita). "
                    "Por favor, espera unos minutos y vuelve a intentarlo."
                )
            raise
