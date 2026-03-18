import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getJugadores } from '../../api/jugadores'
import { getLesionesJugador } from '../../api/lesiones'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function LesionesJugador({ jugador }) {
  const { data: lesiones = [] } = useQuery({
    queryKey: ['lesiones', jugador.id],
    queryFn: () => getLesionesJugador(jugador.id).then(r => r.data)
  })
  const activas = lesiones.filter(l => l.estado !== 'ALTA_MEDICA')
  if (activas.length === 0) return null

  return activas.map(l => (
    <tr key={l.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cn-blue-light flex items-center justify-center text-xs font-medium text-cn-blue-dark">
            {jugador.nombre[0]}{jugador.apellido[0]}
          </div>
          <span className="text-sm font-medium dark:text-white">{jugador.nombre} {jugador.apellido}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-300">{l.tipo_lesion}</td>
      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-300">{l.zona_corporal}</td>
      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-300">{l.fecha_inicio}</td>
      <td className="py-3 px-3">
        <span className={l.gravedad === 'GRAVE' ? 'badge-injured' : l.gravedad === 'MODERADA' ? 'badge-suspended' : 'badge-inactive'}>
          {l.gravedad}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className={l.estado === 'ACTIVA' ? 'badge-injured' : 'badge-suspended'}>
          {l.estado.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
  <Link to={`/lesiones/${l.id}`} className="text-cn-blue hover:text-cn-blue-dark text-xs font-medium">
    Ver detalle
  </Link>
</td>
    </tr>
  ))
}

export default function LesionesList() {
  const { data: jugadores = [], isLoading } = useQuery({
    queryKey: ['jugadores'],
    queryFn: () => getJugadores().then(r => r.data)
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">Lesiones activas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Jugadores con lesiones en curso</p>
      </div>
      <div className="card">
        {isLoading ? (
          <p className="text-sm text-gray-400 py-4">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jugador</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Lesión</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Zona</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Desde</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Gravedad</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map(j => <LesionesJugador key={j.id} jugador={j} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}