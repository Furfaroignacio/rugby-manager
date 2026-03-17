from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class GravedadLesion(str, enum.Enum):
    LEVE = "LEVE"
    MODERADA = "MODERADA"
    GRAVE = "GRAVE"

class EstadoLesion(str, enum.Enum):
    ACTIVA = "ACTIVA"
    EN_RECUPERACION = "EN_RECUPERACION"
    ALTA_MEDICA = "ALTA_MEDICA"

class Lesion(Base):
    __tablename__ = "lesiones"

    id = Column(Integer, primary_key=True, index=True)
    jugador_id = Column(Integer, ForeignKey("jugadores.id"), nullable=False)
    tipo_lesion = Column(String, nullable=False)
    zona_corporal = Column(String, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    gravedad = Column(Enum(GravedadLesion), nullable=False)
    diagnostico = Column(Text, nullable=True)
    tratamiento = Column(Text, nullable=True)
    dias_recuperacion_estimados = Column(Integer, nullable=True)
    estado = Column(Enum(EstadoLesion), default=EstadoLesion.ACTIVA)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    jugador = relationship("Jugador", back_populates="lesiones")
    seguimientos = relationship("SeguimientoLesion", back_populates="lesion")


class SeguimientoLesion(Base):
    """Evolución o seguimiento de una lesión en el tiempo"""
    __tablename__ = "seguimientos_lesion"

    id = Column(Integer, primary_key=True, index=True)
    lesion_id = Column(Integer, ForeignKey("lesiones.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    nota = Column(Text, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    lesion = relationship("Lesion", back_populates="seguimientos")