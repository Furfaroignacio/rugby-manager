import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlantel, getJugadoresPlantel, agregarJugadorPlantel } from '../../api/planteles'
import { getJugadores } from '../../api/jugadores'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

function badgeEstado(estado) {
  const map = { ACTIVO: 'badge-active', LESIONADO: 'badge-injured', SUSPENDIDO: 'badge-suspended', INACTIVO: 'badge-inactive' }
  return map[estado] || 'badge-inactive'
}

export default function PlantelDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('')

  const { data: plantel } = useQuery({ queryKey: ['plantel', id], queryFn: () => getPlantel(id).then(r => r.data) })
  const { data: jugadoresPlantel = [] } = useQuery({ queryKey: ['plantel-jugadores', id], queryFn: () => getJugadoresPlantel(id).then(r => r.data) })
  const { data: todosJugadores = [] } = useQuery({ queryKey: ['jugadores'], queryFn: () => getJugadores().then(r => r.data) })

  const mutation = useMutation({
    mutationFn: (jugadorId) => agregarJugadorPlantel(id, jugadorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['plantel-jugadores', id])
      setJugadorSeleccionado('')
    }
  })

  const jugadoresDisponibles = todosJugadores.filter(j => !jugadoresPlantel.find(jp => jp.id === j.id))

  if (!plantel) return <p className="text-sm text-gray-400">Cargando...</p>

  const activos = jugadoresPlantel.filter(j => j.estado === 'ACTIVO').length
  const noDisponibles = jugadoresPlantel.filter(j => j.estado !== 'ACTIVO').length

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">{plantel.nombre}</h1>
          <p className="text-sm text-gray-500">Temporada {plantel.temporada} {plantel.categoria ? `· ${plantel.categoria}` : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Total jugadores</div>
          <div className="text-2xl font-medium dark:text-white">{jugadoresPlantel.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Disponibles</div>
          <div className="text-2xl font-medium text-cn-yellow">{activos}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">No disponibles</div>
          <div className="text-2xl font-medium dark:text-white">{noDisponibles}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Agregar jugador al plantel</h2>
        <div className="flex gap-2">
          <select
            value={jugadorSeleccionado}
            onChange={e => setJugadorSeleccionado(e.target.value)}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          >
            <option value="">Seleccionar jugador</option>
            {jugadoresDisponibles.map(j => (
              <option key={j.id} value={j.id}>{j.nombre} {j.apellido} — {j.posicion.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button
            onClick={() => mutation.mutate(jugadorSeleccionado)}
            disabled={!jugadorSeleccionado || mutation.isPending}
            className="btn-primary"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Jugadores del plantel ({jugadoresPlantel.length})
        </h2>
        {jugadoresPlantel.length === 0 ? (
          <p className="text-sm text-gray-400">No hay jugadores en este plantel</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jugador</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Posición</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Categoría</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {jugadoresPlantel.map(j => (
                  <tr key={j.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cn-blue-light flex items-center justify-center text-xs font-medium text-cn-blue-dark">
                          {j.nombre[0]}{j.apellido[0]}
                        </div>
                        <span className="font-medium dark:text-white">{j.nombre} {j.apellido}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{j.posicion.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{j.categoria || '—'}</td>
                    <td className="py-3 px-3"><span className={badgeEstado(j.estado)}>{j.estado}</span></td>
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