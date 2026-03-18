import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createJugador } from '../../api/jugadores'
import { ArrowLeft } from 'lucide-react'

const POSICIONES = ['PILAR_IZQUIERDO','HOOKER','PILAR_DERECHO','SEGUNDA_LINEA','FLANKER','OCTAVO','MEDIO_SCRUM','APERTURA','CENTRO','ALA','FULLBACK']

export default function JugadorForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', fecha_nacimiento: '',
    posicion: 'HOOKER', categoria: '', peso_kg: '', altura_cm: ''
  })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: createJugador,
    onSuccess: () => {
      queryClient.invalidateQueries(['jugadores'])
      navigate('/jugadores')
    },
    onError: (e) => setError(e.response?.data?.detail || 'Error al crear jugador')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const datos = {
      ...form,
      peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null,
      altura_cm: form.altura_cm ? parseFloat(form.altura_cm) : null,
      fecha_nacimiento: form.fecha_nacimiento || null,
      dni: form.dni || null,
      categoria: form.categoria || null,
    }
    mutation.mutate(datos)
  }

  const field = (label, name, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        required={required}
        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
      />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Nuevo jugador</h1>
          <p className="text-sm text-gray-500">Completá los datos del jugador</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Nombre', 'nombre', 'text', true)}
            {field('Apellido', 'apellido', 'text', true)}
            {field('DNI', 'dni')}
            {field('Fecha de nacimiento', 'fecha_nacimiento', 'date')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posición *</label>
            <select
              value={form.posicion}
              onChange={e => setForm({ ...form, posicion: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cn-blue"
            >
              {POSICIONES.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {field('Categoría', 'categoria')}
            {field('Peso (kg)', 'peso_kg', 'number')}
            {field('Altura (cm)', 'altura_cm', 'number')}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? 'Guardando...' : 'Guardar jugador'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}