import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { getJugadores } from '../../api/jugadores'

const POSICIONES = ['PILAR_IZQUIERDO','HOOKER','PILAR_DERECHO','SEGUNDA_LINEA','FLANKER','OCTAVO','MEDIO_SCRUM','APERTURA','CENTRO','ALA','FULLBACK']
const ESTADOS = ['ACTIVO','LESIONADO','SUSPENDIDO','INACTIVO']

function badgeEstado(estado) {
  const map = { ACTIVO: 'badge-active', LESIONADO: 'badge-injured', SUSPENDIDO: 'badge-suspended', INACTIVO: 'badge-inactive' }
  return map[estado] || 'badge-inactive'
}

export default function JugadoresList() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroPosicion, setFiltroPosicion] = useState('')

  const { data: jugadores = [], isLoading } = useQuery({
    queryKey: ['jugadores'],
    queryFn: () => getJugadores().then(r => r.data)
  })

  const filtrados = jugadores.filter(j => {
    const nombre = `${j.nombre} ${j.apellido}`.toLowerCase()
    return (
      nombre.includes(busqueda.toLowerCase()) &&
      (filtroEstado ? j.estado === filtroEstado : true) &&
      (filtroPosicion ? j.posicion === filtroPosicion : true)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Jugadores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jugadores.length} jugadores registrados</p>
        </div>
        <Link to="/jugadores/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo jugador
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select
            value={filtroPosicion}
            onChange={e => setFiltroPosicion(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          >
            <option value="">Todas las posiciones</option>
            {POSICIONES.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-400 py-4">Cargando jugadores...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No se encontraron jugadores</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jugador</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Posición</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Categoría</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(j => (
                  <tr key={j.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cn-blue-light flex items-center justify-center text-xs font-medium text-cn-blue-dark">
                          {j.nombre[0]}{j.apellido[0]}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{j.nombre} {j.apellido}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{j.posicion.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{j.categoria || '—'}</td>
                    <td className="py-3 px-3"><span className={badgeEstado(j.estado)}>{j.estado}</span></td>
                    <td className="py-3 px-3 text-right">
                      <Link to={`/jugadores/${j.id}`} className="text-cn-blue hover:text-cn-blue-dark text-xs font-medium">Ver perfil</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}