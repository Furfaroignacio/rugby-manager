from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.partido import Partido, Alineacion
from app.schemas.partido import PartidoCreate, PartidoUpdate, AlineacionCreate

def crear_partido(db: Session, datos: PartidoCreate) -> Partido:
    partido = Partido(**datos.model_dump())
    db.add(partido)
    db.commit()
    db.refresh(partido)
    return partido

def listar_partidos(db: Session):
    return db.query(Partido).order_by(Partido.fecha.desc()).all()

def obtener_partido(db: Session, partido_id: int) -> Partido:
    partido = db.query(Partido).filter(Partido.id == partido_id).first()
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return partido

def actualizar_partido(db: Session, partido_id: int, datos: PartidoUpdate) -> Partido:
    partido = obtener_partido(db, partido_id)
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(partido, campo, valor)
    db.commit()
    db.refresh(partido)
    return partido

def agregar_alineacion(db: Session, partido_id: int, datos: AlineacionCreate) -> Alineacion:
    obtener_partido(db, partido_id)
    alineacion = Alineacion(partido_id=partido_id, **datos.model_dump())
    db.add(alineacion)
    db.commit()
    db.refresh(alineacion)
    return alineacion

def obtener_alineacion(db: Session, partido_id: int):
    return db.query(Alineacion).filter(Alineacion.partido_id == partido_id).all()