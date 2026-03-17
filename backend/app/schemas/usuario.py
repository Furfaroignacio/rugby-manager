from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional
from datetime import datetime

class RolUsuario(str, Enum):
    ADMIN = "ADMIN"
    ENTRENADOR = "ENTRENADOR"
    MEDICO = "MEDICO"

class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    rol: RolUsuario = RolUsuario.ENTRENADOR

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    rol: RolUsuario
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse