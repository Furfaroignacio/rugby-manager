import client from './client'

export const getEstadisticasPartido = (partidoId) => client.get(`/estadisticas/partido/${partidoId}`)
export const getEstadisticasJugador = (jugadorId) => client.get(`/estadisticas/jugador/${jugadorId}`)
export const getResumenJugador = (jugadorId) => client.get(`/estadisticas/jugador/${jugadorId}/resumen`)
export const createEstadistica = (datos) => client.post('/estadisticas', datos)
export const updateEstadistica = (id, datos) => client.patch(`/estadisticas/${id}`, datos)