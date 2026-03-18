import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.db.database import SessionLocal
from app.models.jugador import Jugador, PosicionJugador, EstadoJugador

jugadores = [
    {"nombre": "Mirko", "apellido": "Basar", "posicion": PosicionJugador.PILAR_IZQUIERDO, "categoria": "Primera", "peso_kg": 94, "altura_cm": 178},
    {"nombre": "Maximo", "apellido": "García", "posicion": PosicionJugador.HOOKER, "categoria": "Primera", "peso_kg": 105, "altura_cm": 175},
    {"nombre": "Nicolás", "apellido": "García", "posicion": PosicionJugador.PILAR_DERECHO, "categoria": "Primera", "peso_kg": 115, "altura_cm": 180},
    {"nombre": "Tomás", "apellido": "Martínez", "posicion": PosicionJugador.SEGUNDA_LINEA, "categoria": "Primera", "peso_kg": 108, "altura_cm": 196},
    {"nombre": "Ignacio", "apellido": "Rodríguez", "posicion": PosicionJugador.SEGUNDA_LINEA, "categoria": "Primera", "peso_kg": 110, "altura_cm": 198},
    {"nombre": "Agustín", "apellido": "Pérez", "posicion": PosicionJugador.FLANKER, "categoria": "Primera", "peso_kg": 102, "altura_cm": 185},
    {"nombre": "Facundo", "apellido": "González", "posicion": PosicionJugador.FLANKER, "categoria": "Primera", "peso_kg": 100, "altura_cm": 183},
    {"nombre": "Ramiro", "apellido": "Díaz", "posicion": PosicionJugador.OCTAVO, "categoria": "Primera", "peso_kg": 107, "altura_cm": 188},
    {"nombre": "Luciano", "apellido": "Torres", "posicion": PosicionJugador.MEDIO_SCRUM, "categoria": "Primera", "peso_kg": 85, "altura_cm": 172},
    {"nombre": "Sebastián", "apellido": "Ruiz", "posicion": PosicionJugador.APERTURA, "categoria": "Primera", "peso_kg": 88, "altura_cm": 176},
    {"nombre": "Ezequiel", "apellido": "Vargas", "posicion": PosicionJugador.CENTRO, "categoria": "Primera", "peso_kg": 92, "altura_cm": 180},
    {"nombre": "Leandro", "apellido": "Sánchez", "posicion": PosicionJugador.CENTRO, "categoria": "Primera", "peso_kg": 94, "altura_cm": 181},
    {"nombre": "Rodrigo", "apellido": "Castro", "posicion": PosicionJugador.ALA, "categoria": "Primera", "peso_kg": 87, "altura_cm": 177},
    {"nombre": "Martín", "apellido": "Herrera", "posicion": PosicionJugador.ALA, "categoria": "Primera", "peso_kg": 86, "altura_cm": 175},
    {"nombre": "Pablo", "apellido": "Moreno", "posicion": PosicionJugador.FULLBACK, "categoria": "Primera", "peso_kg": 89, "altura_cm": 179},
    {"nombre": "Diego", "apellido": "Álvarez", "posicion": PosicionJugador.PILAR_IZQUIERDO, "categoria": "Primera", "peso_kg": 110, "altura_cm": 177, "estado": EstadoJugador.LESIONADO},
    {"nombre": "Andrés", "apellido": "Romero", "posicion": PosicionJugador.HOOKER, "categoria": "Primera", "peso_kg": 103, "altura_cm": 174},
    {"nombre": "Federico", "apellido": "Núñez", "posicion": PosicionJugador.SEGUNDA_LINEA, "categoria": "Primera", "peso_kg": 109, "altura_cm": 194},
    {"nombre": "Cristian", "apellido": "Medina", "posicion": PosicionJugador.FLANKER, "categoria": "Primera", "peso_kg": 101, "altura_cm": 184, "estado": EstadoJugador.SUSPENDIDO},
    {"nombre": "Hernán", "apellido": "Suárez", "posicion": PosicionJugador.APERTURA, "categoria": "Reserva", "peso_kg": 86, "altura_cm": 175},
    {"nombre": "Gustavo", "apellido": "Acosta", "posicion": PosicionJugador.MEDIO_SCRUM, "categoria": "Reserva", "peso_kg": 83, "altura_cm": 170},
    {"nombre": "Maximiliano", "apellido": "Benítez", "posicion": PosicionJugador.CENTRO, "categoria": "Reserva", "peso_kg": 91, "altura_cm": 179},
    {"nombre": "Javier", "apellido": "Rojas", "posicion": PosicionJugador.ALA, "categoria": "Reserva", "peso_kg": 85, "altura_cm": 176},
    {"nombre": "Carlos", "apellido": "Vega", "posicion": PosicionJugador.FULLBACK, "categoria": "Reserva", "peso_kg": 88, "altura_cm": 178},
]

def seed():
    db = SessionLocal()
    try:
        existentes = db.query(Jugador).count()
        if existentes > 1:
            print(f"Ya hay {existentes} jugadores en la base. Cancelando para no duplicar.")
            return
        for datos in jugadores:
            jugador = Jugador(**datos)
            db.add(jugador)
        db.commit()
        print(f"✅ {len(jugadores)} jugadores insertados correctamente.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()