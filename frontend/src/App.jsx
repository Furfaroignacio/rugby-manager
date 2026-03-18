import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import JugadoresList from './pages/jugadores/JugadoresList'
import JugadorForm from './pages/jugadores/JugadorForm'
import JugadorDetalle from './pages/jugadores/JugadorDetalle'
import PlantelesList from './pages/planteles/PlantelesList'
import PlantelDetalle from './pages/planteles/PlantelDetalle'
import PartidosList from './pages/partidos/PartidosList'
import PartidoForm from './pages/partidos/PartidoForm'
import PartidoDetalle from './pages/partidos/PartidoDetalle'
import LesionesList from './pages/lesiones/LesionesList'
import LesionDetalle from './pages/lesiones/LesionDetalle'
import Reportes from './pages/Reportes'

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/jugadores" element={<AppLayout><JugadoresList /></AppLayout>} />
      <Route path="/jugadores/nuevo" element={<AppLayout><JugadorForm /></AppLayout>} />
      <Route path="/jugadores/:id" element={<AppLayout><JugadorDetalle /></AppLayout>} />
      <Route path="/planteles" element={<AppLayout><PlantelesList /></AppLayout>} />
      <Route path="/planteles/:id" element={<AppLayout><PlantelDetalle /></AppLayout>} />
      <Route path="/partidos" element={<AppLayout><PartidosList /></AppLayout>} />
      <Route path="/partidos/nuevo" element={<AppLayout><PartidoForm /></AppLayout>} />
      <Route path="/partidos/:id" element={<AppLayout><PartidoDetalle /></AppLayout>} />
      <Route path="/lesiones" element={<AppLayout><LesionesList /></AppLayout>} />
      <Route path="/lesiones/:id" element={<AppLayout><LesionDetalle /></AppLayout>} />
      <Route path="/reportes" element={<AppLayout><Reportes /></AppLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}