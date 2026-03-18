from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.partido import CondicionPartido

class AlineacionCreate(BaseModel):
    jugador_id: int
    numero_camiseta: Optional[int] = None
    es_titular: bool = True
    ingreso_minuto: Optional[int] = None
    salida_minuto: Optional[int] = None

class AlineacionResponse(BaseModel):
    id: int
    jugador_id: int
    numero_camiseta: Optional[int]
    es_titular: bool
    ingreso_minuto: Optional[int]
    salida_minuto: Optional[int]

    class Config:
        from_attributes = True

class PartidoCreate(BaseModel):
    rival: str
    fecha: date
    torneo: Optional[str] = None
    condicion: CondicionPartido
    plantel_id: Optional[int] = None

class PartidoUpdate(BaseModel):
    rival: Optional[str] = None
    fecha: Optional[date] = None
    torneo: Optional[str] = None
    condicion: Optional[CondicionPartido] = None
    puntos_favor: Optional[int] = None
    puntos_contra: Optional[int] = None

class PartidoResponse(BaseModel):
    id: int
    rival: str
    fecha: date
    torneo: Optional[str]
    condicion: CondicionPartido
    puntos_favor: Optional[int]
    puntos_contra: Optional[int]
    plantel_id: Optional[int]
    creado_en: datetime

    class Config:
        from_attributes = True

class PartidoConAlineacion(PartidoResponse):
    alineaciones: List[AlineacionResponse] = []