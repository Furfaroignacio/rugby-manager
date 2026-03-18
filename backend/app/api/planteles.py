from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.plantel import PlantelCreate, PlantelUpdate, PlantelResponse
from app.schemas.jugador import JugadorResponse
from app.services import plantel_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/planteles", tags=["Planteles"])

@router.post("/", response_model=PlantelResponse, status_code=201)
def crear(datos: PlantelCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.crear_plantel(db, datos)

@router.get("/", response_model=List[PlantelResponse])
def listar(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.listar_planteles(db)

@router.get("/{plantel_id}", response_model=PlantelResponse)
def obtener(plantel_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.obtener_plantel(db, plantel_id)

@router.patch("/{plantel_id}", response_model=PlantelResponse)
def actualizar(plantel_id: int, datos: PlantelUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.actualizar_plantel(db, plantel_id, datos)

@router.post("/{plantel_id}/jugadores/{jugador_id}")
def agregar_jugador(plantel_id: int, jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.agregar_jugador_plantel(db, plantel_id, jugador_id)

@router.get("/{plantel_id}/jugadores", response_model=List[JugadorResponse])
def listar_jugadores(plantel_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return plantel_service.obtener_jugadores_plantel(db, plantel_id)