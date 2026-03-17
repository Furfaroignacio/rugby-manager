from sqlalchemy import Column, Integer, String, Enum, Float, Date, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class PosicionJugador(str, enum.Enum):
    PILAR_IZQUIERDO = "PILAR_IZQUIERDO"
    HOOKER = "HOOKER"
    PILAR_DERECHO = "PILAR_DERECHO"
    SEGUNDA_LINEA = "SEGUNDA_LINEA"
    FLANKER = "FLANKER"
    OCTAVO = "OCTAVO"
    MEDIO_SCRUM = "MEDIO_SCRUM"
    APERTURA = "APERTURA"
    CENTRO = "CENTRO"
    ALA = "ALA"
    FULLBACK = "FULLBACK"

class EstadoJugador(str, enum.Enum):
    ACTIVO = "ACTIVO"
    LESIONADO = "LESIONADO"
    SUSPENDIDO = "SUSPENDIDO"
    INACTIVO = "INACTIVO"

class Jugador(Base):
    __tablename__ = "jugadores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    fecha_nacimiento = Column(Date, nullable=True)
    dni = Column(String, unique=True, nullable=True)
    posicion = Column(Enum(PosicionJugador), nullable=False)
    categoria = Column(String, nullable=True)
    peso_kg = Column(Float, nullable=True)
    altura_cm = Column(Float, nullable=True)
    estado = Column(Enum(EstadoJugador), default=EstadoJugador.ACTIVO)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    lesiones = relationship("Lesion", back_populates="jugador")
    plantel_jugadores = relationship("PlantelJugador", back_populates="jugador")