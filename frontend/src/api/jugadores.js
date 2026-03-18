import client from './client'

export const getJugadores = (params) => client.get('/jugadores', { params })
export const getJugador = (id) => client.get(`/jugadores/${id}`)
export const createJugador = (datos) => client.post('/jugadores', datos)
export const updateJugador = (id, datos) => client.patch(`/jugadores/${id}`, datos)
export const deleteJugador = (id) => client.delete(`/jugadores/${id}`)