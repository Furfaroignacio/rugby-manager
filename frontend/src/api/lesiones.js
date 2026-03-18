import client from './client'

export const getLesionesJugador = (jugadorId) => client.get(`/lesiones/jugador/${jugadorId}`)
export const getLesion = (id) => client.get(`/lesiones/${id}`)
export const createLesion = (datos) => client.post('/lesiones', datos)
export const updateLesion = (id, datos) => client.patch(`/lesiones/${id}`, datos)
export const agregarSeguimiento = (id, datos) => client.post(`/lesiones/${id}/seguimientos`, datos)