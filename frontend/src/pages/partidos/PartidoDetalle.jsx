import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPartido, updatePartido, getAlineacion, agregarAlineacion } from '../../api/partidos'
import { getEstadisticasPartido, createEstadistica } from '../../api/estadisticas'
import { getJugadores } from '../../api/jugadores'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function PartidoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: partido } = useQuery({ queryKey: ['partido', id], queryFn: () => getPartido(id).then(r => r.data) })
  const { data: alineacion = [] } = useQuery({ queryKey: ['alineacion', id], queryFn: () => getAlineacion(id).then(r => r.data) })
  const { data: estadisticas = [] } = useQuery({ queryKey: ['estadisticas-partido', id], queryFn: () => getEstadisticasPartido(id).then(r => r.data) })
  const { data: jugadores = [] } = useQuery({ queryKey: ['jugadores'], queryFn: () => getJugadores().then(r => r.data) })

  const [resultado, setResultado] = useState({ puntos_favor: '', puntos_contra: '' })
  const [nuevaAlin, setNuevaAlin] = useState({ jugador_id: '', numero_camiseta: '', es_titular: true })
  const [nuevaEst, setNuevaEst] = useState({ jugador_id: '', tries: 0, tackles: 0, penales_cometidos: 0 })

  const mutResultado = useMutation({
    mutationFn: (datos) => updatePartido(id, datos),
    onSuccess: () => queryClient.invalidateQueries(['partido', id])
  })

  const mutAlineacion = useMutation({
    mutationFn: (datos) => agregarAlineacion(id, datos),
    onSuccess: () => { queryClient.invalidateQueries(['alineacion', id]); setNuevaAlin({ jugador_id: '', numero_camiseta: '', es_titular: true }) }
  })

  const mutEstadistica = useMutation({
    mutationFn: (datos) => createEstadistica({ ...datos, partido_id: parseInt(id) }),
    onSuccess: () => { queryClient.invalidateQueries(['estadisticas-partido', id]); setNuevaEst({ jugador_id: '', tries: 0, tackles: 0, penales_cometidos: 0 }) }
  })

  if (!partido) return <p className="text-sm text-gray-400">Cargando...</p>

  const jugadoresEnPartido = alineacion.map(a => a.jugador_id)
  const jugadoresSinEst = jugadores.filter(j => !estadisticas.find(e => e.jugador_id === j.id))

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">vs {partido.rival}</h1>
          <p className="text-sm text-gray-500">{partido.fecha} · {partido.condicion} {partido.torneo ? `· ${partido.torneo}` : ''}</p>
        </div>
      </div>

      {/* Resultado */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resultado</h2>
        <div className="flex items-center gap-3">
          <input type="number" placeholder="Nuestros puntos" value={resultado.puntos_favor}
            onChange={e => setResultado({ ...resultado, puntos_favor: e.target.value })}
            className="w-40 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          />
          <span className="text-gray-400">—</span>
          <input type="number" placeholder="Puntos rival" value={resultado.puntos_contra}
            onChange={e => setResultado({ ...resultado, puntos_contra: e.target.value })}
            className="w-40 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          />
          <button onClick={() => mutResultado.mutate({ puntos_favor: parseInt(resultado.puntos_favor), puntos_contra: parseInt(resultado.puntos_contra) })} className="btn-primary">
            Guardar
          </button>
          {partido.puntos_favor !== null && (
            <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
              Actual: {partido.puntos_favor} - {partido.puntos_contra}
            </span>
          )}
        </div>
      </div>

      {/* Alineación */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Alineación ({alineacion.length} jugadores)</h2>
        <div className="flex gap-2 mb-4">
          <select value={nuevaAlin.jugador_id} onChange={e => setNuevaAlin({ ...nuevaAlin, jugador_id: e.target.value })}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue">
            <option value="">Seleccionar jugador</option>
            {jugadores.filter(j => !jugadoresEnPartido.includes(j.id)).map(j => (
              <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
            ))}
          </select>
          <input type="number" placeholder="Camiseta" value={nuevaAlin.numero_camiseta}
            onChange={e => setNuevaAlin({ ...nuevaAlin, numero_camiseta: e.target.value })}
            className="w-24 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          />
          <select value={nuevaAlin.es_titular} onChange={e => setNuevaAlin({ ...nuevaAlin, es_titular: e.target.value === 'true' })}
            className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue">
            <option value="true">Titular</option>
            <option value="false">Suplente</option>
          </select>
          <button onClick={() => mutAlineacion.mutate({ jugador_id: parseInt(nuevaAlin.jugador_id), numero_camiseta: nuevaAlin.numero_camiseta ? parseInt(nuevaAlin.numero_camiseta) : null, es_titular: nuevaAlin.es_titular })}
            disabled={!nuevaAlin.jugador_id} className="btn-primary">
            Agregar
          </button>
        </div>
        {alineacion.length > 0 && (
          <div className="space-y-1">
            {alineacion.map(a => {
              const j = jugadores.find(jj => jj.id === a.jugador_id)
              return (
                <div key={a.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  {a.numero_camiseta && <span className="w-7 h-7 bg-cn-yellow text-cn-black text-xs font-medium rounded flex items-center justify-center">{a.numero_camiseta}</span>}
                  <span className="text-sm dark:text-white">{j ? `${j.nombre} ${j.apellido}` : `Jugador #${a.jugador_id}`}</span>
                  <span className={a.es_titular ? 'badge-active ml-auto' : 'badge-inactive ml-auto'}>{a.es_titular ? 'Titular' : 'Suplente'}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estadísticas del partido</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          <select value={nuevaEst.jugador_id} onChange={e => setNuevaEst({ ...nuevaEst, jugador_id: e.target.value })}
            className="flex-1 min-w-40 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue">
            <option value="">Seleccionar jugador</option>
            {jugadoresSinEst.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
          </select>
          {[['tries','Tries'],['tackles','Tackles'],['penales_cometidos','Penales']].map(([key, label]) => (
            <input key={key} type="number" min="0" placeholder={label} value={nuevaEst[key]}
              onChange={e => setNuevaEst({ ...nuevaEst, [key]: parseInt(e.target.value) || 0 })}
              className="w-24 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            />
          ))}
          <button onClick={() => mutEstadistica.mutate({ jugador_id: parseInt(nuevaEst.jugador_id), tries: nuevaEst.tries, tackles: nuevaEst.tackles, penales_cometidos: nuevaEst.penales_cometidos })}
            disabled={!nuevaEst.jugador_id} className="btn-primary">
            Registrar
          </button>
        </div>
        {estadisticas.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-2 text-xs font-medium text-gray-500">Jugador</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500">Tries</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500">Tackles</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500">Penales</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map(e => {
                const j = jugadores.find(jj => jj.id === e.jugador_id)
                return (
                  <tr key={e.id} className="border-b border-gray-50 dark:border-gray-700">
                    <td className="py-2 dark:text-white">{j ? `${j.nombre} ${j.apellido}` : `#${e.jugador_id}`}</td>
                    <td className="py-2 text-center text-cn-yellow font-medium">{e.tries}</td>
                    <td className="py-2 text-center dark:text-white">{e.tackles}</td>
                    <td className="py-2 text-center dark:text-white">{e.penales_cometidos}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}