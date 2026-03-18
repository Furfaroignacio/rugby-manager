from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.plantel import Plantel, PlantelJugador
from app.models.jugador import Jugador
from app.schemas.plantel import PlantelCreate, PlantelUpdate

def crear_plantel(db: Session, datos: PlantelCreate) -> Plantel:
    plantel = Plantel(**datos.model_dump())
    db.add(plantel)
    db.commit()
    db.refresh(plantel)
    return plantel

def listar_planteles(db: Session):
    return db.query(Plantel).filter(Plantel.activo == True).all()

def obtener_plantel(db: Session, plantel_id: int) -> Plantel:
    plantel = db.query(Plantel).filter(Plantel.id == plantel_id).first()
    if not plantel:
        raise HTTPException(status_code=404, detail="Plantel no encontrado")
    return plantel

def actualizar_plantel(db: Session, plantel_id: int, datos: PlantelUpdate) -> Plantel:
    plantel = obtener_plantel(db, plantel_id)
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(plantel, campo, valor)
    db.commit()
    db.refresh(plantel)
    return plantel

def agregar_jugador_plantel(db: Session, plantel_id: int, jugador_id: int):
    obtener_plantel(db, plantel_id)
    jugador = db.query(Jugador).filter(Jugador.id == jugador_id).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    existe = db.query(PlantelJugador).filter(
        PlantelJugador.plantel_id == plantel_id,
        PlantelJugador.jugador_id == jugador_id
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="El jugador ya está en el plantel")
    relacion = PlantelJugador(plantel_id=plantel_id, jugador_id=jugador_id)
    db.add(relacion)
    db.commit()
    return {"mensaje": "Jugador agregado al plantel"}

def obtener_jugadores_plantel(db: Session, plantel_id: int):
    obtener_plantel(db, plantel_id)
    relaciones = db.query(PlantelJugador).filter(PlantelJugador.plantel_id == plantel_id).all()
    return [r.jugador for r in relaciones]