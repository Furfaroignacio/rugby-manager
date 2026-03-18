from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, jugadores, planteles, partidos, estadisticas, penales, lesiones

app = FastAPI(
    title="Rugby Manager API",
    description="Sistema de gestión deportiva para equipos de rugby",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jugadores.router)
app.include_router(planteles.router)
app.include_router(partidos.router)
app.include_router(estadisticas.router)
app.include_router(penales.router)
app.include_router(lesiones.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Rugby Manager API funcionando"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}