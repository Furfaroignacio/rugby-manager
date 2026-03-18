from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.lesion import LesionCreate, LesionUpdate, LesionResponse, SeguimientoCreate, SeguimientoResponse
from app.services import lesion_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/lesiones", tags=["Lesiones"])

@router.post("/", response_model=LesionResponse, status_code=201)
def registrar(datos: LesionCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return lesion_service.registrar_lesion(db, datos)

@router.get("/jugador/{jugador_id}", response_model=List[LesionResponse])
def por_jugador(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return lesion_service.listar_lesiones_jugador(db, jugador_id)

@router.get("/{lesion_id}", response_model=LesionResponse)
def obtener(lesion_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return lesion_service.obtener_lesion(db, lesion_id)

@router.patch("/{lesion_id}", response_model=LesionResponse)
def actualizar(lesion_id: int, datos: LesionUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return lesion_service.actualizar_lesion(db, lesion_id, datos)

@router.post("/{lesion_id}/seguimientos", response_model=SeguimientoResponse, status_code=201)
def agregar_seguimiento(lesion_id: int, datos: SeguimientoCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return lesion_service.agregar_seguimiento(db, lesion_id, datos)