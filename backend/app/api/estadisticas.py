from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.estadistica import EstadisticaCreate, EstadisticaUpdate, EstadisticaResponse
from app.services import estadistica_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/estadisticas", tags=["Estadísticas"])

@router.post("/", response_model=EstadisticaResponse, status_code=201)
def crear(datos: EstadisticaCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return estadistica_service.crear_estadistica(db, datos)

@router.patch("/{estadistica_id}", response_model=EstadisticaResponse)
def actualizar(estadistica_id: int, datos: EstadisticaUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return estadistica_service.actualizar_estadistica(db, estadistica_id, datos)

@router.get("/partido/{partido_id}", response_model=List[EstadisticaResponse])
def por_partido(partido_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return estadistica_service.obtener_estadisticas_partido(db, partido_id)

@router.get("/jugador/{jugador_id}", response_model=List[EstadisticaResponse])
def por_jugador(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return estadistica_service.obtener_estadisticas_jugador(db, jugador_id)

@router.get("/jugador/{jugador_id}/resumen")
def resumen_jugador(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    r = estadistica_service.resumen_jugador(db, jugador_id)
    return {
        "tries": r.tries or 0,
        "tackles": r.tackles or 0,
        "penales_cometidos": r.penales_cometidos or 0,
        "tarjetas_amarillas": r.tarjetas_amarillas or 0,
        "tarjetas_rojas": r.tarjetas_rojas or 0,
    }