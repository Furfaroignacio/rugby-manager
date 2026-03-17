from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate
from app.core.security import hash_password, verify_password, create_access_token

def registrar_usuario(db: Session, datos: UsuarioCreate) -> Usuario:
    existe = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese email"
        )
    usuario = Usuario(
        nombre=datos.nombre,
        apellido=datos.apellido,
        email=datos.email,
        password_hash=hash_password(datos.password),
        rol=datos.rol
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

def login_usuario(db: Session, email: str, password: str) -> dict:
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario or not verify_password(password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    token = create_access_token(data={"sub": str(usuario.id), "rol": usuario.rol})
    return {"token": token, "usuario": usuario}