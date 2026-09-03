import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/applications/dashboard-stats/')
      .then((response) => setStats(response.data))
      .catch(() => setError('Failed to load dashboard stats'))
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Log Out</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats && (
        <div>
          <p>Total applications: {stats.total_applications}</p>
          <ul>
            {stats.status_breakdown.map((s) => (
              <li key={s.status}>{s.status}: {s.count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DashboardPage