from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth  # agregar

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

# Routers
app.include_router(auth.router)  # agregar

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Rugby Manager API funcionando"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}