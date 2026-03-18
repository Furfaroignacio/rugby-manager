import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPartido, getAlineacion } from '../../api/partidos'
import { getJugadores } from '../../api/jugadores'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const POSICIONES_CANCHA = {
  PILAR_IZQUIERDO:  { x: 35, y: 78, numero: 1 },
  HOOKER:           { x: 50, y: 78, numero: 2 },
  PILAR_DERECHO:    { x: 65, y: 78, numero: 3 },
  SEGUNDA_LINEA:    { x: 38, y: 65, numero: 4 },
  SEGUNDA_LINEA_2:  { x: 62, y: 65, numero: 5 },
  FLANKER:          { x: 25, y: 65, numero: 6 },
  OCTAVO:           { x: 50, y: 58, numero: 8 },
  FLANKER_2:        { x: 75, y: 65, numero: 7 },
  MEDIO_SCRUM:      { x: 50, y: 48, numero: 9 },
  APERTURA:         { x: 30, y: 40, numero: 10 },
  ALA:              { x: 15, y: 30, numero: 11 },
  CENTRO:           { x: 38, y: 33, numero: 12 },
  CENTRO_2:         { x: 62, y: 33, numero: 13 },
  ALA_2:            { x: 85, y: 30, numero: 14 },
  FULLBACK:         { x: 50, y: 18, numero: 15 },
}

function JugadorEnCancha({ jugador, alin, onClick, seleccionado }) {
  const pos = POSICIONES_CANCHA[jugador._slot]
  if (!pos) return null

  return (
    <div
      onClick={() => onClick(jugador)}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      className={`absolute flex flex-col items-center cursor-pointer group`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all
        ${seleccionado
          ? 'bg-cn-yellow border-cn-yellow text-cn-black scale-110'
          : 'bg-cn-blue border-white text-white hover:scale-105'
        }`}>
        {alin?.numero_camiseta || pos.numero}
      </div>
      <div className={`mt-1 text-center px-1 py-0.5 rounded text-xs font-medium whitespace-nowrap
        ${seleccionado ? 'bg-cn-yellow text-cn-black' : 'bg-black/60 text-white'}`}>
        {jugador.apellido}
      </div>
    </div>
  )
}

export default function Cancha() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [seleccionado, setSeleccionado] = useState(null)

  const { data: partido } = useQuery({ queryKey: ['partido', id], queryFn: () => getPartido(id).then(r => r.data) })
  const { data: alineacion = [] } = useQuery({ queryKey: ['alineacion', id], queryFn: () => getAlineacion(id).then(r => r.data) })
  const { data: jugadores = [] } = useQuery({ queryKey: ['jugadores'], queryFn: () => getJugadores().then(r => r.data) })

  const titulares = alineacion.filter(a => a.es_titular)
  const suplentes = alineacion.filter(a => !a.es_titular)

  const slots = Object.keys(POSICIONES_CANCHA)

  const jugadoresEnCancha = titulares.map((a, i) => {
    const jugador = jugadores.find(j => j.id === a.jugador_id)
    if (!jugador) return null
    return { ...jugador, _slot: slots[i] || jugador.posicion, _alin: a }
  }).filter(Boolean)

  const jugadorSeleccionado = seleccionado ? jugadores.find(j => j.id === seleccionado) : null
  const alinSeleccionado = seleccionado ? alineacion.find(a => a.jugador_id === seleccionado) : null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">
            {partido ? `vs ${partido.rival}` : 'Cancha'}
          </h1>
          <p className="text-sm text-gray-500">Vista táctica — titulares</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cancha */}
        <div className="lg:col-span-2">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '140%', background: '#2d5a1b' }}>
            {/* Líneas de la cancha */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 140" preserveAspectRatio="none">
              {/* Fondo */}
              <rect x="0" y="0" width="100" height="140" fill="#2d5a1b" />
              {/* Franjas */}
              {Array.from({ length: 7 }).map((_, i) => (
                <rect key={i} x="0" y={i * 20} width="100" height="10" fill="#2a551a" />
              ))}
              {/* Borde */}
              <rect x="3" y="5" width="94" height="130" fill="none" stroke="white" strokeWidth="0.5" opacity="0.7" />
              {/* Línea del medio */}
              <line x1="3" y1="70" x2="97" y2="70" stroke="white" strokeWidth="0.5" opacity="0.7" />
              {/* Zonas de try */}
              <rect x="3" y="5" width="94" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
              <rect x="3" y="120" width="94" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
              {/* Líneas de 22 */}
              <line x1="3" y1="30" x2="97" y2="30" stroke="white" strokeWidth="0.3" opacity="0.5" strokeDasharray="2,2" />
              <line x1="3" y1="110" x2="97" y2="110" stroke="white" strokeWidth="0.3" opacity="0.5" strokeDasharray="2,2" />
              {/* Punto de medio */}
              <circle cx="50" cy="70" r="1" fill="white" opacity="0.7" />
              <circle cx="50" cy="70" r="5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
              {/* H palos */}
              <line x1="45" y1="5" x2="45" y2="0" stroke="white" strokeWidth="0.8" opacity="0.8" />
              <line x1="55" y1="5" x2="55" y2="0" stroke="white" strokeWidth="0.8" opacity="0.8" />
              <line x1="45" y1="135" x2="45" y2="140" stroke="white" strokeWidth="0.8" opacity="0.8" />
              <line x1="55" y1="135" x2="55" y2="140" stroke="white" strokeWidth="0.8" opacity="0.8" />
            </svg>

            {/* Jugadores */}
            <div className="absolute inset-0">
              {jugadoresEnCancha.map(j => (
                <JugadorEnCancha
                  key={j.id}
                  jugador={j}
                  alin={j._alin}
                  onClick={(jug) => setSeleccionado(seleccionado === jug.id ? null : jug.id)}
                  seleccionado={seleccionado === j.id}
                />
              ))}
              {jugadoresEnCancha.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-sm">Sin titulares en la alineación</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-4">
          {/* Info jugador seleccionado */}
          {jugadorSeleccionado ? (
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-cn-blue flex items-center justify-center text-white font-medium">
                  {jugadorSeleccionado.nombre[0]}{jugadorSeleccionado.apellido[0]}
                </div>
                <div>
                  <p className="font-medium dark:text-white">{jugadorSeleccionado.nombre} {jugadorSeleccionado.apellido}</p>
                  <p className="text-xs text-gray-500">{jugadorSeleccionado.posicion.replace(/_/g, ' ')}</p>
                </div>
                {alinSeleccionado?.numero_camiseta && (
                  <div className="ml-auto w-8 h-8 bg-cn-yellow rounded flex items-center justify-center text-sm font-medium text-cn-black">
                    {alinSeleccionado.numero_camiseta}
                  </div>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Condición</span>
                  <span className={alinSeleccionado?.es_titular ? 'badge-active' : 'badge-inactive'}>
                    {alinSeleccionado?.es_titular ? 'Titular' : 'Suplente'}
                  </span>
                </div>
                {jugadorSeleccionado.peso_kg && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peso</span>
                    <span className="dark:text-white">{jugadorSeleccionado.peso_kg} kg</span>
                  </div>
                )}
                {jugadorSeleccionado.altura_cm && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Altura</span>
                    <span className="dark:text-white">{jugadorSeleccionado.altura_cm} cm</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <p className="text-sm text-gray-400 text-center py-4">Hacé click en un jugador para ver su info</p>
            </div>
          )}

          {/* Titulares */}
          <div className="card">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titulares ({titulares.length}/15)
            </h2>
            <div className="space-y-1">
              {titulares.map((a, i) => {
                const j = jugadores.find(jj => jj.id === a.jugador_id)
                if (!j) return null
                return (
                  <div key={a.id}
                    onClick={() => setSeleccionado(seleccionado === j.id ? null : j.id)}
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors
                      ${seleccionado === j.id ? 'bg-cn-blue-light' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <div className="w-5 h-5 bg-cn-yellow rounded text-xs font-medium text-cn-black flex items-center justify-center flex-shrink-0">
                      {a.numero_camiseta || i + 1}
                    </div>
                    <span className="text-sm dark:text-white">{j.nombre} {j.apellido}</span>
                  </div>
                )
              })}
              {titulares.length === 0 && <p className="text-sm text-gray-400">Sin titulares</p>}
            </div>
          </div>

          {/* Suplentes */}
          {suplentes.length > 0 && (
            <div className="card">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suplentes ({suplentes.length})
              </h2>
              <div className="space-y-1">
                {suplentes.map((a, i) => {
                  const j = jugadores.find(jj => jj.id === a.jugador_id)
                  if (!j) return null
                  return (
                    <div key={a.id} className="flex items-center gap-2 py-1.5">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center flex-shrink-0">
                        {a.numero_camiseta || 15 + i + 1}
                      </div>
                      <span className="text-sm dark:text-white">{j.nombre} {j.apellido}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}