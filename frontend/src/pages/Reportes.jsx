import { useQuery } from '@tanstack/react-query'
import { getJugadores } from '../api/jugadores'
import { getPartidos } from '../api/partidos'

function RankingBar({ label, value, max, accent }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-300 w-36 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: accent ? '#F2C94C' : '#3DB7E4' }}
        />
      </div>
      <span className="text-sm font-medium dark:text-white w-6 text-right">{value}</span>
    </div>
  )
}

export default function Reportes() {
  const { data: jugadores = [] } = useQuery({ queryKey: ['jugadores'], queryFn: () => getJugadores().then(r => r.data) })
  const { data: partidos = [] } = useQuery({ queryKey: ['partidos'], queryFn: () => getPartidos().then(r => r.data) })

  const victorias = partidos.filter(p => p.puntos_favor !== null && p.puntos_favor > p.puntos_contra).length
  const derrotas = partidos.filter(p => p.puntos_favor !== null && p.puntos_favor < p.puntos_contra).length
  const empates = partidos.filter(p => p.puntos_favor !== null && p.puntos_favor === p.puntos_contra).length
  const sinResultado = partidos.filter(p => p.puntos_favor === null).length

  const puntosTotal = partidos.reduce((acc, p) => acc + (p.puntos_favor || 0), 0)
  const puntosContra = partidos.reduce((acc, p) => acc + (p.puntos_contra || 0), 0)

  const porPosicion = jugadores.reduce((acc, j) => {
    acc[j.posicion] = (acc[j.posicion] || 0) + 1
    return acc
  }, {})

  const porEstado = {
    ACTIVO: jugadores.filter(j => j.estado === 'ACTIVO').length,
    LESIONADO: jugadores.filter(j => j.estado === 'LESIONADO').length,
    SUSPENDIDO: jugadores.filter(j => j.estado === 'SUSPENDIDO').length,
    INACTIVO: jugadores.filter(j => j.estado === 'INACTIVO').length,
  }

  const maxPosicion = Math.max(...Object.values(porPosicion), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">Reportes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del equipo</p>
      </div>

      {/* Stats generales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Partidos jugados</div>
          <div className="text-2xl font-medium dark:text-white">{partidos.filter(p => p.puntos_favor !== null).length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Victorias</div>
          <div className="text-2xl font-medium text-green-500">{victorias}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Derrotas</div>
          <div className="text-2xl font-medium text-red-400">{derrotas}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">% victorias</div>
          <div className="text-2xl font-medium text-cn-yellow">
            {partidos.filter(p => p.puntos_favor !== null).length > 0
              ? Math.round((victorias / partidos.filter(p => p.puntos_favor !== null).length) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resultados */}
        <div className="card">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Resultados</h2>
          <div className="space-y-3">
            <RankingBar label="Victorias" value={victorias} max={partidos.length} accent={false} />
            <RankingBar label="Derrotas" value={derrotas} max={partidos.length} accent={false} />
            <RankingBar label="Empates" value={empates} max={partidos.length} accent={false} />
            <RankingBar label="Sin resultado" value={sinResultado} max={partidos.length} accent={false} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Puntos a favor</div>
              <div className="text-xl font-medium text-cn-yellow">{puntosTotal}</div>
            </div>
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Puntos en contra</div>
              <div className="text-xl font-medium dark:text-white">{puntosContra}</div>
            </div>
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="card">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Disponibilidad del plantel</h2>
          <div className="space-y-3">
            <RankingBar label="Activos" value={porEstado.ACTIVO} max={jugadores.length} accent={false} />
            <RankingBar label="Lesionados" value={porEstado.LESIONADO} max={jugadores.length} accent={true} />
            <RankingBar label="Suspendidos" value={porEstado.SUSPENDIDO} max={jugadores.length} accent={false} />
            <RankingBar label="Inactivos" value={porEstado.INACTIVO} max={jugadores.length} accent={false} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 mb-2">Jugadores por posición</div>
            <div className="space-y-2">
              {Object.entries(porPosicion).sort((a, b) => b[1] - a[1]).map(([pos, cant]) => (
                <RankingBar key={pos} label={pos.replace(/_/g, ' ')} value={cant} max={maxPosicion} accent={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}