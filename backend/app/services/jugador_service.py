from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.jugador import Jugador
from app.schemas.jugador import JugadorCreate, JugadorUpdate

def crear_jugador(db: Session, datos: JugadorCreate) -> Jugador:
    if datos.dni:
        existe = db.query(Jugador).filter(Jugador.dni == datos.dni).first()
        if existe:
            raise HTTPException(status_code=400, detail="Ya existe un jugador con ese DNI")
    jugador = Jugador(**datos.model_dump())
    db.add(jugador)
    db.commit()
    db.refresh(jugador)
    return jugador

def listar_jugadores(db: Session, estado=None, posicion=None):
    query = db.query(Jugador).filter(Jugador.activo == True)
    if estado:
        query = query.filter(Jugador.estado == estado)
    if posicion:
        query = query.filter(Jugador.posicion == posicion)
    return query.all()

def obtener_jugador(db: Session, jugador_id: int) -> Jugador:
    jugador = db.query(Jugador).filter(Jugador.id == jugador_id, Jugador.activo == True).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return jugador

def actualizar_jugador(db: Session, jugador_id: int, datos: JugadorUpdate) -> Jugador:
    jugador = obtener_jugador(db, jugador_id)
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(jugador, campo, valor)
    db.commit()
    db.refresh(jugador)
    return jugador

def eliminar_jugador(db: Session, jugador_id: int):
    jugador = obtener_jugador(db, jugador_id)
    jugador.activo = False  # baja lógica
    db.commit()
    return {"mensaje": "Jugador eliminado correctamente"}