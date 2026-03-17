from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Plantel(Base):
    __tablename__ = "planteles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    temporada = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    jugadores = relationship("PlantelJugador", back_populates="plantel")


class PlantelJugador(Base):
    """Tabla intermedia que asocia jugadores a un plantel"""
    __tablename__ = "plantel_jugadores"

    id = Column(Integer, primary_key=True, index=True)
    plantel_id = Column(Integer, ForeignKey("planteles.id"), nullable=False)
    jugador_id = Column(Integer, ForeignKey("jugadores.id"), nullable=False)
    fecha_ingreso = Column(DateTime(timezone=True), server_default=func.now())

    plantel = relationship("Plantel", back_populates="jugadores")
    jugador = relationship("Jugador", back_populates="plantel_jugadores")