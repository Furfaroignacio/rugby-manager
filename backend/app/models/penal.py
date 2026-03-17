from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class TipoPenal(str, enum.Enum):
    OFFSIDE = "OFFSIDE"
    TACKLE_ALTO = "TACKLE_ALTO"
    NO_RELEASE = "NO_RELEASE"
    HOLDING_ON = "HOLDING_ON"
    SIDE_ENTRY = "SIDE_ENTRY"
    COLLAPSING_SCRUM = "COLLAPSING_SCRUM"
    NOT_ROLLING_AWAY = "NOT_ROLLING_AWAY"
    INFRACCION_LINEOUT = "INFRACCION_LINEOUT"
    JUEGO_PELIGROSO = "JUEGO_PELIGROSO"
    INCONDUCTA = "INCONDUCTA"
    REPETICION_INFRACCIONES = "REPETICION_INFRACCIONES"
    OTRO = "OTRO"

class Penal(Base):
    __tablename__ = "penales"

    id = Column(Integer, primary_key=True, index=True)
    partido_id = Column(Integer, ForeignKey("partidos.id"), nullable=False)
    jugador_id = Column(Integer, ForeignKey("jugadores.id"), nullable=False)
    tipo = Column(Enum(TipoPenal), nullable=False)
    minuto = Column(Integer, nullable=True)
    descripcion = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    partido = relationship("Partido", back_populates="penales")
    jugador = relationship("Jugador")