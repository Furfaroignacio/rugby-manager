import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJugador, updateJugador } from '../../api/jugadores'
import { getEstadisticasJugador, getResumenJugador } from '../../api/estadisticas'
import { getLesionesJugador } from '../../api/lesiones'
import { ArrowLeft } from 'lucide-react'

const ESTADOS = ['ACTIVO','LESIONADO','SUSPENDIDO','INACTIVO']

function badgeEstado(estado) {
  const map = { ACTIVO: 'badge-active', LESIONADO: 'badge-injured', SUSPENDIDO: 'badge-suspended', INACTIVO: 'badge-inactive' }
  return map[estado] || 'badge-inactive'
}

export default function JugadorDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: jugador, isLoading } = useQuery({ queryKey: ['jugador', id], queryFn: () => getJugador(id).then(r => r.data) })
  const { data: resumen } = useQuery({ queryKey: ['resumen', id], queryFn: () => getResumenJugador(id).then(r => r.data) })
  const { data: lesiones = [] } = useQuery({ queryKey: ['lesiones', id], queryFn: () => getLesionesJugador(id).then(r => r.data) })

  const mutation = useMutation({
    mutationFn: (estado) => updateJugador(id, { estado }),
    onSuccess: () => queryClient.invalidateQueries(['jugador', id])
  })

  if (isLoading) return <p className="text-sm text-gray-400">Cargando...</p>
  if (!jugador) return <p className="text-sm text-red-500">Jugador no encontrado</p>

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">{jugador.nombre} {jugador.apellido}</h1>
          <p className="text-sm text-gray-500">{jugador.posicion.replace(/_/g, ' ')} · {jugador.categoria || 'Sin categoría'}</p>
        </div>
        <span className={badgeEstado(jugador.estado)}>{jugador.estado}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card space-y-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Datos personales</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">DNI</span><span className="dark:text-white">{jugador.dni || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Nacimiento</span><span className="dark:text-white">{jugador.fecha_nacimiento || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Peso</span><span className="dark:text-white">{jugador.peso_kg ? `${jugador.peso_kg} kg` : '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Altura</span><span className="dark:text-white">{jugador.altura_cm ? `${jugador.altura_cm} cm` : '—'}</span></div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cambiar estado</label>
            <select
              value={jugador.estado}
              onChange={e => mutation.mutate(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            >
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estadísticas acumuladas</h2>
          {!resumen ? <p className="text-sm text-gray-400">Sin estadísticas</p> : (
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Tries', resumen.tries, true],
                ['Tackles', resumen.tackles, false],
                ['Penales', resumen.penales_cometidos, false],
                ['T. Amarillas', resumen.tarjetas_amarillas, false],
                ['T. Rojas', resumen.tarjetas_rojas, false],
              ].map(([label, val, accent]) => (
                <div key={label} className="stat-card">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className={`text-xl font-medium ${accent ? 'text-cn-yellow' : 'dark:text-white'}`}>{val ?? 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Historial de lesiones</h2>
          <Link to={`/lesiones`} className="text-xs text-cn-blue hover:text-cn-blue-dark">Ver todas</Link>
        </div>
        {lesiones.length === 0 ? (
          <p className="text-sm text-gray-400">Sin lesiones registradas</p>
        ) : (
          <div className="space-y-2">
            {lesiones.map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium dark:text-white">{l.tipo_lesion}</p>
                  <p className="text-xs text-gray-500">{l.zona_corporal} · {l.fecha_inicio}</p>
                </div>
                <span className={l.estado === 'ALTA_MEDICA' ? 'badge-active' : l.estado === 'ACTIVA' ? 'badge-injured' : 'badge-suspended'}>
                  {l.estado.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 