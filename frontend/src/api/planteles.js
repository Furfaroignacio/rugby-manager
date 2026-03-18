import client from './client'

export const getPlanteles = () => client.get('/planteles')
export const getPlantel = (id) => client.get(`/planteles/${id}`)
export const createPlantel = (datos) => client.post('/planteles', datos)
export const updatePlantel = (id, datos) => client.patch(`/planteles/${id}`, datos)
export const getJugadoresPlantel = (id) => client.get(`/planteles/${id}/jugadores`)
export const agregarJugadorPlantel = (plantelId, jugadorId) =>
  client.post(`/planteles/${plantelId}/jugadores/${jugadorId}`)