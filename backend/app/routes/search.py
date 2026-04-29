from fastapi import APIRouter, HTTPException, Query
from app.services.search_service import SearchService

router = APIRouter()
search_service = SearchService()


@router.get("/search")
async def search_recipes(
    q: str = Query(..., min_length=2, description="Consulta de búsqueda de recetas"),
    num: int = Query(5, ge=1, le=10, description="Número de resultados (1-10)"),
):
    """
    Busca recetas en blogs de cocina mediante Google Custom Search API.
    """
    try:
        results = await search_service.search_recipes(q, num)
        return {
            "query": q,
            "results": results,
            "total": len(results),
            "configured": search_service.is_configured(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/health")
async def search_health():
    return {
        "status": "ok",
        "search_configured": search_service.is_configured(),
    }
