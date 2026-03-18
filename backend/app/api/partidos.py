from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.partido import PartidoCreate, PartidoUpdate, PartidoResponse, AlineacionCreate, AlineacionResponse
from app.services import partido_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/partidos", tags=["Partidos"])

@router.post("/", response_model=PartidoResponse, status_code=201)
def crear(datos: PartidoCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.crear_partido(db, datos)

@router.get("/", response_model=List[PartidoResponse])
def listar(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.listar_partidos(db)

@router.get("/{partido_id}", response_model=PartidoResponse)
def obtener(partido_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.obtener_partido(db, partido_id)

@router.patch("/{partido_id}", response_model=PartidoResponse)
def actualizar(partido_id: int, datos: PartidoUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.actualizar_partido(db, partido_id, datos)

@router.post("/{partido_id}/alineacion", response_model=AlineacionResponse, status_code=201)
def agregar_alineacion(partido_id: int, datos: AlineacionCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.agregar_alineacion(db, partido_id, datos)

@router.get("/{partido_id}/alineacion", response_model=List[AlineacionResponse])
def obtener_alineacion(partido_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return partido_service.obtener_alineacion(db, partido_id)