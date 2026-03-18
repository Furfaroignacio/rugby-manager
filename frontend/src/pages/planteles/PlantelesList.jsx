import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { getPlanteles, createPlantel } from '../../api/planteles'

export default function PlantelesList() {
  const queryClient = useQueryClient()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', temporada: '', categoria: '' })
  const [error, setError] = useState('')

  const { data: planteles = [], isLoading } = useQuery({
    queryKey: ['planteles'],
    queryFn: () => getPlanteles().then(r => r.data)
  })

  const mutation = useMutation({
    mutationFn: createPlantel,
    onSuccess: () => {
      queryClient.invalidateQueries(['planteles'])
      setForm({ nombre: '', temporada: '', categoria: '' })
      setMostrarForm(false)
    },
    onError: (e) => setError(e.response?.data?.detail || 'Error al crear plantel')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ ...form, categoria: form.categoria || null })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Planteles</h1>
          <p className="text-sm text-gray-500 mt-0.5">{planteles.length} planteles registrados</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo plantel
        </button>
      </div>

      {mostrarForm && (
        <div className="card">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Crear plantel</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                <input type="text" value={form.nombre} required
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Temporada *</label>
                <input type="text" value={form.temporada} required placeholder="ej: 2025"
                  onChange={e => setForm({ ...form, temporada: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Categoría</label>
                <input type="text" value={form.categoria} placeholder="ej: Primera"
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={mutation.isPending} className="btn-primary">
                {mutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-sm text-gray-400">Cargando planteles...</p>
        ) : planteles.length === 0 ? (
          <p className="text-sm text-gray-400">No hay planteles registrados</p>
        ) : (
          planteles.map(p => (
            <Link key={p.id} to={`/planteles/${p.id}`} className="card hover:border-cn-blue transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-cn-blue-light flex items-center justify-center">
                  <span className="text-cn-blue-dark font-medium text-sm">CN</span>
                </div>
                <span className={p.activo ? 'badge-active' : 'badge-inactive'}>{p.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-cn-blue transition-colors">{p.nombre}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Temporada {p.temporada}</p>
              {p.categoria && <p className="text-xs text-gray-400 mt-1">{p.categoria}</p>}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}