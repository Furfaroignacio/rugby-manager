import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPartido } from '../../api/partidos'
import { ArrowLeft } from 'lucide-react'

export default function PartidoForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    rival: '', fecha: '', torneo: '', condicion: 'LOCAL', plantel_id: ''
  })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: createPartido,
    onSuccess: () => {
      queryClient.invalidateQueries(['partidos'])
      navigate('/partidos')
    },
    onError: (e) => setError(e.response?.data?.detail || 'Error al crear partido')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      plantel_id: form.plantel_id ? parseInt(form.plantel_id) : null,
      torneo: form.torneo || null,
    })
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Nuevo partido</h1>
          <p className="text-sm text-gray-500">Registrá un nuevo partido</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rival *</label>
            <input
              type="text" value={form.rival} required
              onChange={e => setForm({ ...form, rival: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha *</label>
              <input
                type="date" value={form.fecha} required
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condición *</label>
              <select
                value={form.condicion}
                onChange={e => setForm({ ...form, condicion: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
              >
                <option value="LOCAL">Local</option>
                <option value="VISITANTE">Visitante</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Torneo</label>
            <input
              type="text" value={form.torneo}
              onChange={e => setForm({ ...form, torneo: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? 'Guardando...' : 'Guardar partido'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}