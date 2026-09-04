import { useEffect, useState } from 'react'
import api from '../api/axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2F5D50', '#C97D2C', '#A8453B', '#4A564E', '#8DA290']

function InsightsPage() {
  const [insights, setInsights] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/applications/insights/').then((res) => setInsights(res.data)).catch(() => setError('Failed to load insights'))
  }, [])

  if (error) return <p className="form-error">{error}</p>
  if (!insights) return <p>Loading…</p>

  return (
    <div>
      <h1>Insights</h1>
      <div className="stat-total">{insights.response_rate_percent}%</div>
      <p>{insights.responded_count} of {insights.total_applications} applications got a response</p>

      <h2>By source</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={insights.applications_by_source} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label>
            {insights.applications_by_source.map((entry, index) => (
              <Cell key={entry.source} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default InsightsPage