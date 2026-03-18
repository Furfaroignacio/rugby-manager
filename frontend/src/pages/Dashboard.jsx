import { useQuery } from '@tanstack/react-query'
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react'
import { getJugadores } from '../api/jugadores'
import { getPartidos } from '../api/partidos'
import { useAuth } from '../context/AuthContext'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <Icon size={16} className="text-gray-400" />
      </div>
      <div className={`text-2xl font-medium ${accent ? 'text-cn-yellow' : 'text-gray-900 dark:text-white'}`}>
        {value ?? '—'}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const { data: jugadores = [] } = useQuery({ queryKey: ['jugadores'], queryFn: () => getJugadores().then(r => r.data) })
  const { data: partidos = [] } = useQuery({ queryKey: ['partidos'], queryFn: () => getPartidos().then(r => r.data) })

  const activos = jugadores.filter(j => j.estado === 'ACTIVO').length
  const lesionados = jugadores.filter(j => j.estado === 'LESIONADO').length
  const suspendidos = jugadores.filter(j => j.estado === 'SUSPENDIDO').length

  const ultimosPartidos = partidos.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Panel de control — Centro Naval Rugby</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Jugadores activos" value={activos} />
        <StatCard icon={Activity} label="Lesionados" value={lesionados} />
        <StatCard icon={TrendingUp} label="Suspendidos" value={suspendidos} />
        <StatCard icon={Calendar} label="Partidos jugados" value={partidos.length} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Últimos partidos</h2>
          {ultimosPartidos.length === 0 ? (
            <p className="text-sm text-gray-400">No hay partidos registrados</p>
          ) : (
            <div className="space-y-3">
              {ultimosPartidos.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">vs {p.rival}</p>
                    <p className="text-xs text-gray-500">{p.fecha} · {p.condicion}</p>
                  </div>
                  {p.puntos_favor !== null ? (
                    <span className={`text-sm font-medium ${p.puntos_favor > p.puntos_contra ? 'text-green-500' : 'text-red-500'}`}>
                      {p.puntos_favor} - {p.puntos_contra}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Sin resultado</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Estado del plantel</h2>
          {jugadores.length === 0 ? (
            <p className="text-sm text-gray-400">No hay jugadores registrados</p>
          ) : (
            <div className="space-y-2">
              {jugadores.filter(j => j.estado !== 'ACTIVO').map(j => (
                <div key={j.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{j.nombre} {j.apellido}</p>
                    <p className="text-xs text-gray-500">{j.posicion.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={
                    j.estado === 'LESIONADO' ? 'badge-injured' :
                    j.estado === 'SUSPENDIDO' ? 'badge-suspended' : 'badge-inactive'
                  }>{j.estado}</span>
                </div>
              ))}
              {jugadores.filter(j => j.estado !== 'ACTIVO').length === 0 && (
                <p className="text-sm text-green-500">Todo el plantel disponible</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}