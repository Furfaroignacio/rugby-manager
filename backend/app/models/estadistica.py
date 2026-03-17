from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Estadistica(Base):
    __tablename__ = "estadisticas"

    id = Column(Integer, primary_key=True, index=True)
    partido_id = Column(Integer, ForeignKey("partidos.id"), nullable=False)
    jugador_id = Column(Integer, ForeignKey("jugadores.id"), nullable=False)

    tries = Column(Integer, default=0)
    tackles = Column(Integer, default=0)
    conversiones = Column(Integer, default=0)
    penales_convertidos = Column(Integer, default=0)
    penales_errados = Column(Integer, default=0)
    drops = Column(Integer, default=0)
    tarjetas_amarillas = Column(Integer, default=0)
    tarjetas_rojas = Column(Integer, default=0)
    scrums_ganados = Column(Integer, default=0)
    lineouts_ganados = Column(Integer, default=0)
    penales_cometidos = Column(Integer, default=0)
    penales_recibidos = Column(Integer, default=0)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    partido = relationship("Partido", back_populates="estadisticas")
    jugador = relationship("Jugador")