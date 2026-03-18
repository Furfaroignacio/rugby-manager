from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.jugador import PosicionJugador, EstadoJugador

class JugadorCreate(BaseModel):
    nombre: str
    apellido: str
    fecha_nacimiento: Optional[date] = None
    dni: Optional[str] = None
    posicion: PosicionJugador
    categoria: Optional[str] = None
    peso_kg: Optional[float] = None
    altura_cm: Optional[float] = None

class JugadorUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    posicion: Optional[PosicionJugador] = None
    categoria: Optional[str] = None
    peso_kg: Optional[float] = None
    altura_cm: Optional[float] = None
    estado: Optional[EstadoJugador] = None

class JugadorResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    fecha_nacimiento: Optional[date]
    dni: Optional[str]
    posicion: PosicionJugador
    categoria: Optional[str]
    peso_kg: Optional[float]
    altura_cm: Optional[float]
    estado: EstadoJugador
    creado_en: datetime

    class Config:
        from_attributes = True