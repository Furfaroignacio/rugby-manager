from sqlalchemy import Column, Integer, String, Enum, Date, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class CondicionPartido(str, enum.Enum):
    LOCAL = "LOCAL"
    VISITANTE = "VISITANTE"

class Partido(Base):
    __tablename__ = "partidos"

    id = Column(Integer, primary_key=True, index=True)
    rival = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    torneo = Column(String, nullable=True)
    condicion = Column(Enum(CondicionPartido), nullable=False)
    puntos_favor = Column(Integer, nullable=True)
    puntos_contra = Column(Integer, nullable=True)
    plantel_id = Column(Integer, ForeignKey("planteles.id"), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    alineaciones = relationship("Alineacion", back_populates="partido")
    estadisticas = relationship("Estadistica", back_populates="partido")
    penales = relationship("Penal", back_populates="partido")


class Alineacion(Base):
    """Jugador en un partido: titular, suplente, número de camiseta"""
    __tablename__ = "alineaciones"

    id = Column(Integer, primary_key=True, index=True)
    partido_id = Column(Integer, ForeignKey("partidos.id"), nullable=False)
    jugador_id = Column(Integer, ForeignKey("jugadores.id"), nullable=False)
    numero_camiseta = Column(Integer, nullable=True)
    es_titular = Column(Boolean, default=True)
    ingreso_minuto = Column(Integer, nullable=True)
    salida_minuto = Column(Integer, nullable=True)

    partido = relationship("Partido", back_populates="alineaciones")
    jugador = relationship("Jugador")