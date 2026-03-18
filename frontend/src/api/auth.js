import client from './client'

export const login = (datos) => client.post('/auth/login', datos)
export const getMe = () => client.get('/auth/me')