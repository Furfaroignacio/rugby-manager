from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.lesion import Lesion, SeguimientoLesion
from app.schemas.lesion import LesionCreate, LesionUpdate, SeguimientoCreate

def registrar_lesion(db: Session, datos: LesionCreate) -> Lesion:
    lesion = Lesion(**datos.model_dump())
    db.add(lesion)
    db.commit()
    db.refresh(lesion)
    return lesion

def obtener_lesion(db: Session, lesion_id: int) -> Lesion:
    lesion = db.query(Lesion).filter(Lesion.id == lesion_id).first()
    if not lesion:
        raise HTTPException(status_code=404, detail="Lesión no encontrada")
    return lesion

def listar_lesiones_jugador(db: Session, jugador_id: int):
    return db.query(Lesion).filter(Lesion.jugador_id == jugador_id).all()

def actualizar_lesion(db: Session, lesion_id: int, datos: LesionUpdate) -> Lesion:
    lesion = obtener_lesion(db, lesion_id)
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(lesion, campo, valor)
    db.commit()
    db.refresh(lesion)
    return lesion

def agregar_seguimiento(db: Session, lesion_id: int, datos: SeguimientoCreate) -> SeguimientoLesion:
    obtener_lesion(db, lesion_id)
    seguimiento = SeguimientoLesion(lesion_id=lesion_id, **datos.model_dump())
    db.add(seguimiento)
    db.commit()
    db.refresh(seguimiento)
    return seguimiento