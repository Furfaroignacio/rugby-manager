from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.penal import TipoPenal

class PenalCreate(BaseModel):
    partido_id: int
    jugador_id: int
    tipo: TipoPenal
    minuto: Optional[int] = None
    descripcion: Optional[str] = None

class PenalResponse(BaseModel):
    id: int
    partido_id: int
    jugador_id: int
    tipo: TipoPenal
    minuto: Optional[int]
    descripcion: Optional[str]
    creado_en: datetime

    class Config:
        from_attributes = True