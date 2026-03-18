from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.jugador import JugadorCreate, JugadorUpdate, JugadorResponse
from app.services import jugador_service
from app.core.dependencies import get_current_user
from app.models.jugador import EstadoJugador, PosicionJugador

router = APIRouter(prefix="/jugadores", tags=["Jugadores"])

@router.post("/", response_model=JugadorResponse, status_code=201)
def crear(datos: JugadorCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return jugador_service.crear_jugador(db, datos)

@router.get("/", response_model=List[JugadorResponse])
def listar(
    estado: Optional[EstadoJugador] = None,
    posicion: Optional[PosicionJugador] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    return jugador_service.listar_jugadores(db, estado, posicion)

@router.get("/{jugador_id}", response_model=JugadorResponse)
def obtener(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return jugador_service.obtener_jugador(db, jugador_id)

@router.patch("/{jugador_id}", response_model=JugadorResponse)
def actualizar(jugador_id: int, datos: JugadorUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return jugador_service.actualizar_jugador(db, jugador_id, datos)

@router.delete("/{jugador_id}")
def eliminar(jugador_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return jugador_service.eliminar_jugador(db, jugador_id)