import { Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useAuth()
  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {darkMode ? <Sun size={18} className="text-cn-yellow" /> : <Moon size={18} className="text-gray-500" />}
    </button>
  )
}