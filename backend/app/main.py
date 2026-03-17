from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Rugby Manager API",
    description="Sistema de gestión deportiva para equipos de rugby",
    version="1.0.0",
)

# CORS — permite que el frontend en React pueda llamar al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL de Vite en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Rugby Manager API funcionando"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}