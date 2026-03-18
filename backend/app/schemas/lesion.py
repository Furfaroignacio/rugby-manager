from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.lesion import GravedadLesion, EstadoLesion

class SeguimientoCreate(BaseModel):
    fecha: date
    nota: str

class SeguimientoResponse(BaseModel):
    id: int
    lesion_id: int
    fecha: date
    nota: str
    creado_en: datetime

    class Config:
        from_attributes = True

class LesionCreate(BaseModel):
    jugador_id: int
    tipo_lesion: str
    zona_corporal: str
    fecha_inicio: date
    gravedad: GravedadLesion
    diagnostico: Optional[str] = None
    tratamiento: Optional[str] = None
    dias_recuperacion_estimados: Optional[int] = None

class LesionUpdate(BaseModel):
    tipo_lesion: Optional[str] = None
    zona_corporal: Optional[str] = None
    gravedad: Optional[GravedadLesion] = None
    diagnostico: Optional[str] = None
    tratamiento: Optional[str] = None
    dias_recuperacion_estimados: Optional[int] = None
    estado: Optional[EstadoLesion] = None

class LesionResponse(BaseModel):
    id: int
    jugador_id: int
    tipo_lesion: str
    zona_corporal: str
    fecha_inicio: date
    gravedad: GravedadLesion
    diagnostico: Optional[str]
    tratamiento: Optional[str]
    dias_recuperacion_estimados: Optional[int]
    estado: EstadoLesion
    creado_en: datetime
    seguimientos: List[SeguimientoResponse] = []

    class Config:
        from_attributes = True