import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


class SearchService:
    def __init__(self):
        self.api_key = os.getenv("CUSTOM_SEARCH_API_KEY")
        self.cx = os.getenv("CUSTOM_SEARCH_ENGINE_ID")

    def is_configured(self) -> bool:
        return bool(self.api_key and self.cx)

    async def search_recipes(self, query: str, num: int = 5) -> list[dict]:
        """
        Busca recetas en blogs de cocina usando Google Custom Search API.
        Devuelve una lista de resultados con title, link, snippet y thumbnail.
        """
        if not self.is_configured():
            raise Exception(
                "CUSTOM_SEARCH_API_KEY o CUSTOM_SEARCH_ENGINE_ID no configurados."
            )

        params = {
            "key": self.api_key,
            "cx": self.cx,
            "q": query,
            "num": min(num, 10),  # Google CSE máximo 10 por petición
            "searchType": "web",
            "lr": "lang_es",       # Preferir resultados en español
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GOOGLE_SEARCH_URL, params=params)
            response.raise_for_status()
            data = response.json()

        items = data.get("items", [])
        results = []
        for item in items:
            # Extraer miniatura si existe (pagemap -> cse_image o cse_thumbnail)
            thumbnail = None
            pagemap = item.get("pagemap", {})
            for key in ("cse_image", "cse_thumbnail"):
                images = pagemap.get(key, [])
                if images and images[0].get("src"):
                    thumbnail = images[0]["src"]
                    break

            results.append(
                {
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "thumbnail": thumbnail,
                    "displayLink": item.get("displayLink", ""),
                }
            )

        return results
