import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getPartidos } from '../../api/partidos'

function ResultadoBadge({ partido }) {
  if (partido.puntos_favor === null) return <span className="badge-inactive">Sin resultado</span>
  if (partido.puntos_favor > partido.puntos_contra) return <span className="badge-active">Victoria</span>
  if (partido.puntos_favor < partido.puntos_contra) return <span className="badge-injured">Derrota</span>
  return <span className="badge-suspended">Empate</span>
}

export default function PartidosList() {
  const { data: partidos = [], isLoading } = useQuery({
    queryKey: ['partidos'],
    queryFn: () => getPartidos().then(r => r.data)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Partidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{partidos.length} partidos registrados</p>
        </div>
        <Link to="/partidos/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo partido
        </Link>
      </div>

      <div className="card">
        {isLoading ? (
          <p className="text-sm text-gray-400 py-4">Cargando partidos...</p>
        ) : partidos.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No hay partidos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Rival</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Torneo</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Condición</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Resultado</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {partidos.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">vs {p.rival}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{p.fecha}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{p.torneo || '—'}</td>
                    <td className="py-3 px-3">
                      <span className={p.condicion === 'LOCAL' ? 'badge-active' : 'badge-inactive'}>
                        {p.condicion}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">
                      {p.puntos_favor !== null ? `${p.puntos_favor} - ${p.puntos_contra}` : '—'}
                    </td>
                    <td className="py-3 px-3"><ResultadoBadge partido={p} /></td>
                    <td className="py-3 px-3 text-right">
                      <Link to={`/partidos/${p.id}`} className="text-cn-blue hover:text-cn-blue-dark text-xs font-medium">Ver detalle</Link>
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