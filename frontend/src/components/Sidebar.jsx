import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Shield, Calendar, Activity, FileBarChart, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jugadores', label: 'Jugadores', icon: Users },
  { to: '/planteles', label: 'Planteles', icon: Shield },
  { to: '/partidos', label: 'Partidos', icon: Calendar },
  { to: '/lesiones', label: 'Lesiones', icon: Activity },
  { to: '/reportes', label: 'Reportes', icon: FileBarChart },
]

export default function Sidebar() {
  const { usuario, logout } = useAuth()
  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="bg-cn-blue p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cn-blue font-bold text-sm">CN</div>
        <span className="text-white font-medium text-sm">Centro Naval Rugby</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-cn-blue-light text-cn-blue-dark font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{usuario?.nombre} {usuario?.apellido}</div>
        <div className="px-3 py-1 text-xs text-cn-blue font-medium mb-2">{usuario?.rol}</div>
        <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}