from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EstadisticaCreate(BaseModel):
    partido_id: int
    jugador_id: int
    tries: int = 0
    tackles: int = 0
    conversiones: int = 0
    penales_convertidos: int = 0
    penales_errados: int = 0
    drops: int = 0
    tarjetas_amarillas: int = 0
    tarjetas_rojas: int = 0
    scrums_ganados: int = 0
    lineouts_ganados: int = 0
    penales_cometidos: int = 0
    penales_recibidos: int = 0

class EstadisticaUpdate(BaseModel):
    tries: Optional[int] = None
    tackles: Optional[int] = None
    conversiones: Optional[int] = None
    penales_convertidos: Optional[int] = None
    penales_errados: Optional[int] = None
    drops: Optional[int] = None
    tarjetas_amarillas: Optional[int] = None
    tarjetas_rojas: Optional[int] = None
    scrums_ganados: Optional[int] = None
    lineouts_ganados: Optional[int] = None
    penales_cometidos: Optional[int] = None
    penales_recibidos: Optional[int] = None

class EstadisticaResponse(BaseModel):
    id: int
    partido_id: int
    jugador_id: int
    tries: int
    tackles: int
    conversiones: int
    penales_convertidos: int
    penales_errados: int
    drops: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    scrums_ganados: int
    lineouts_ganados: int
    penales_cometidos: int
    penales_recibidos: int
    creado_en: datetime

    class Config:
        from_attributes = True