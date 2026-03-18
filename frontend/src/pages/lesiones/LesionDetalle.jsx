import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLesion, updateLesion, agregarSeguimiento } from '../../api/lesiones'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const ESTADOS = ['ACTIVA', 'EN_RECUPERACION', 'ALTA_MEDICA']

export default function LesionDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({ fecha: '', nota: '' })

  const { data: lesion, isLoading } = useQuery({
    queryKey: ['lesion', id],
    queryFn: () => getLesion(id).then(r => r.data)
  })

  const mutEstado = useMutation({
    mutationFn: (estado) => updateLesion(id, { estado }),
    onSuccess: () => queryClient.invalidateQueries(['lesion', id])
  })

  const mutSeguimiento = useMutation({
    mutationFn: (datos) => agregarSeguimiento(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries(['lesion', id])
      setNuevoSeguimiento({ fecha: '', nota: '' })
    }
  })

  if (isLoading) return <p className="text-sm text-gray-400">Cargando...</p>
  if (!lesion) return <p className="text-sm text-red-500">Lesión no encontrada</p>

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">{lesion.tipo_lesion}</h1>
          <p className="text-sm text-gray-500">{lesion.zona_corporal} · desde {lesion.fecha_inicio}</p>
        </div>
        <span className={lesion.estado === 'ACTIVA' ? 'badge-injured' : lesion.estado === 'EN_RECUPERACION' ? 'badge-suspended' : 'badge-active'}>
          {lesion.estado.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Datos de la lesión */}
      <div className="card space-y-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Información clínica</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="stat-card">
            <div className="text-xs text-gray-500 mb-1">Gravedad</div>
            <div className="font-medium dark:text-white">{lesion.gravedad}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-gray-500 mb-1">Días estimados</div>
            <div className="font-medium text-cn-yellow">{lesion.dias_recuperacion_estimados ?? '—'}</div>
          </div>
        </div>
        {lesion.diagnostico && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Diagnóstico</p>
            <p className="text-sm dark:text-white">{lesion.diagnostico}</p>
          </div>
        )}
        {lesion.tratamiento && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Tratamiento</p>
            <p className="text-sm dark:text-white">{lesion.tratamiento}</p>
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Cambiar estado</label>
          <select
            value={lesion.estado}
            onChange={e => mutEstado.mutate(e.target.value)}
            className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
          >
            {ESTADOS.map(e => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Seguimientos */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Seguimientos ({lesion.seguimientos?.length || 0})
        </h2>

        {/* Formulario nuevo seguimiento */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={nuevoSeguimiento.fecha}
              onChange={e => setNuevoSeguimiento({ ...nuevoSeguimiento, fecha: e.target.value })}
              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            />
          </div>
          <textarea
            placeholder="Nota de evolución..."
            value={nuevoSeguimiento.nota}
            onChange={e => setNuevoSeguimiento({ ...nuevoSeguimiento, nota: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue resize-none"
          />
          <button
            onClick={() => mutSeguimiento.mutate(nuevoSeguimiento)}
            disabled={!nuevoSeguimiento.fecha || !nuevoSeguimiento.nota || mutSeguimiento.isPending}
            className="btn-primary text-sm"
          >
            {mutSeguimiento.isPending ? 'Guardando...' : 'Agregar seguimiento'}
          </button>
        </div>

        {/* Lista de seguimientos */}
        {!lesion.seguimientos?.length ? (
          <p className="text-sm text-gray-400">Sin seguimientos registrados</p>
        ) : (
          <div className="space-y-3">
            {lesion.seguimientos.slice().reverse().map(s => (
              <div key={s.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-cn-blue mt-1.5 flex-shrink-0" />
                  <div className="w-px flex-1 bg-gray-100 dark:bg-gray-700 mt-1" />
                </div>
                <div className="pb-3">
                  <p className="text-xs text-gray-500 mb-0.5">{s.fecha}</p>
                  <p className="text-sm dark:text-white">{s.nota}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}