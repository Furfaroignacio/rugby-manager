from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, LoginRequest, TokenResponse
from app.services.auth_service import registrar_usuario, login_usuario
from app.core.dependencies import get_current_user
from app.models.usuario import Usuario

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UsuarioResponse, status_code=201)
def register(datos: UsuarioCreate, db: Session = Depends(get_db)):
    return registrar_usuario(db, datos)

@router.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    resultado = login_usuario(db, datos.email, datos.password)
    return TokenResponse(
        access_token=resultado["token"],
        usuario=resultado["usuario"]
    )

@router.get("/me", response_model=UsuarioResponse)
def me(current_user: Usuario = Depends(get_current_user)):
    return current_user