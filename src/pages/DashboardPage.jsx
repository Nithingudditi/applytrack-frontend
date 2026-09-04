import { useEffect, useState } from 'react'
import api from '../api/axios'
import { statusClass } from '../utils/status'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/applications/dashboard-stats/')
      .then((response) => setStats(response.data))
      .catch(() => setError('Failed to load dashboard stats'))
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p className="form-error">{error}</p>}
      {stats && (
        <div>
          <div className="stat-total">{stats.total_applications}</div>
          <div className="stat-breakdown">
            {stats.status_breakdown.map((s) => (
              <span key={s.status} className={statusClass(s.status)}>
                {s.status} · {s.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage