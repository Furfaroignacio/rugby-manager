import client from './client'

export const getPartidos = () => client.get('/partidos')
export const getPartido = (id) => client.get(`/partidos/${id}`)
export const createPartido = (datos) => client.post('/partidos', datos)
export const updatePartido = (id, datos) => client.patch(`/partidos/${id}`, datos)
export const getAlineacion = (id) => client.get(`/partidos/${id}/alineacion`)
export const agregarAlineacion = (id, datos) => client.post(`/partidos/${id}/alineacion`, datos)