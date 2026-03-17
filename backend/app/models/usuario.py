from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class RolUsuario(str, enum.Enum):
    ADMIN = "ADMIN"
    ENTRENADOR = "ENTRENADOR"
    MEDICO = "MEDICO"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol = Column(Enum(RolUsuario), nullable=False, default=RolUsuario.ENTRENADOR)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())