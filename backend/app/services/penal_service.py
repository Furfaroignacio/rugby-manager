from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.penal import Penal
from app.schemas.penal import PenalCreate

def registrar_penal(db: Session, datos: PenalCreate) -> Penal:
    penal = Penal(**datos.model_dump())
    db.add(penal)
    db.commit()
    db.refresh(penal)
    return penal

def obtener_penales_partido(db: Session, partido_id: int):
    return db.query(Penal).filter(Penal.partido_id == partido_id).all()

def obtener_penales_jugador(db: Session, jugador_id: int):
    return db.query(Penal).filter(Penal.jugador_id == jugador_id).all()

def ranking_penales_por_tipo(db: Session):
    return db.query(
        Penal.tipo,
        func.count(Penal.id).label("cantidad")
    ).group_by(Penal.tipo).order_by(func.count(Penal.id).desc()).all()