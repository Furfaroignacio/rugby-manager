import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    const temaGuardado = localStorage.getItem('darkMode')
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado))
    if (temaGuardado === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    setCargando(false)
  }, [])

  const loginContext = (token, usuarioData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuarioData))
    setUsuario(usuarioData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const toggleDarkMode = () => {
    const nuevo = !darkMode
    setDarkMode(nuevo)
    localStorage.setItem('darkMode', nuevo)
    document.documentElement.classList.toggle('dark', nuevo)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, loginContext, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)