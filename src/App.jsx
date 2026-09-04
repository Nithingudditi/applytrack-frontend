import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ResumesPage from './pages/ResumesPage'
import InsightsPage from './pages/InsightsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><Layout><ApplicationsPage /></Layout></ProtectedRoute>} />
      <Route path="/applications/:id" element={<ProtectedRoute><Layout><ApplicationDetailPage /></Layout></ProtectedRoute>} />
      <Route path="/resumes" element={<ProtectedRoute><Layout><ResumesPage /></Layout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Layout><InsightsPage /></Layout></ProtectedRoute>} />
    </Routes>
  )
}

export default App