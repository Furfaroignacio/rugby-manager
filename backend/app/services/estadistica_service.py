from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import func
from app.models.estadistica import Estadistica
from app.schemas.estadistica import EstadisticaCreate, EstadisticaUpdate

def crear_estadistica(db: Session, datos: EstadisticaCreate) -> Estadistica:
    existe = db.query(Estadistica).filter(
        Estadistica.partido_id == datos.partido_id,
        Estadistica.jugador_id == datos.jugador_id
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="Ya existe estadística para este jugador en este partido")
    estadistica = Estadistica(**datos.model_dump())
    db.add(estadistica)
    db.commit()
    db.refresh(estadistica)
    return estadistica

def actualizar_estadistica(db: Session, estadistica_id: int, datos: EstadisticaUpdate) -> Estadistica:
    est = db.query(Estadistica).filter(Estadistica.id == estadistica_id).first()
    if not est:
        raise HTTPException(status_code=404, detail="Estadística no encontrada")
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(est, campo, valor)
    db.commit()
    db.refresh(est)
    return est

def obtener_estadisticas_partido(db: Session, partido_id: int):
    return db.query(Estadistica).filter(Estadistica.partido_id == partido_id).all()

def obtener_estadisticas_jugador(db: Session, jugador_id: int):
    return db.query(Estadistica).filter(Estadistica.jugador_id == jugador_id).all()

def resumen_jugador(db: Session, jugador_id: int):
    resultado = db.query(
        func.sum(Estadistica.tries).label("tries"),
        func.sum(Estadistica.tackles).label("tackles"),
        func.sum(Estadistica.penales_cometidos).label("penales_cometidos"),
        func.sum(Estadistica.tarjetas_amarillas).label("tarjetas_amarillas"),
        func.sum(Estadistica.tarjetas_rojas).label("tarjetas_rojas"),
    ).filter(Estadistica.jugador_id == jugador_id).first()
    return resultado