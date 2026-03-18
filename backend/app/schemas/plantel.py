from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.jugador import JugadorResponse

class PlantelCreate(BaseModel):
    nombre: str
    temporada: str
    categoria: Optional[str] = None

class PlantelUpdate(BaseModel):
    nombre: Optional[str] = None
    temporada: Optional[str] = None
    categoria: Optional[str] = None
    activo: Optional[bool] = None

class PlantelResponse(BaseModel):
    id: int
    nombre: str
    temporada: str
    categoria: Optional[str]
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True

class PlantelConJugadores(PlantelResponse):
    jugadores: List[JugadorResponse] = []