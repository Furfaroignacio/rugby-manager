from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.penal import PenalCreate, PenalResponse
from app.services import penal_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/penales", tags=["Penales"])

@router.post("/", response_model=PenalResponse, status_code=201)
def registrar(datos: PenalCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return penal_service.registrar_penal(db, datos)

@router.get("/partido/{partido_id}", response_model=List[PenalResponse])
def por_partido(partido_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return penal_service.obtener_penales_partido(db, partido_id)

@router.get("/jugador/{jugador_id}", response_model=List[PenalResponse])
def por_jugador(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return penal_service.obtener_penales_jugador(db, jugador_id)

@router.get("/ranking/tipos")
def ranking_tipos(db: Session = Depends(get_db), _=Depends(get_current_user)):
    resultado = penal_service.ranking_penales_por_tipo(db)
    return [{"tipo": r.tipo, "cantidad": r.cantidad} for r in resultado]