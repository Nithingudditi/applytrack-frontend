import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { statusClass } from '../utils/status'

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [appliedDate, setAppliedDate] = useState('')
  const [formError, setFormError] = useState('')

  const fetchApplications = () => {
    api.get('/applications/')
      .then((response) => setApplications(response.data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      await api.post('/applications/', { company, role, applied_date: appliedDate })
      setCompany('')
      setRole('')
      setAppliedDate('')
      fetchApplications()
    } catch (err) {
      setFormError('Failed to create application')
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <h1>Applications</h1>

      <form onSubmit={handleCreate} className="field-row">
        <div className="field">
          <label>Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div className="field">
          <label>Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="field">
          <label>Applied date</label>
          <input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      {formError && <p className="form-error">{formError}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="app-list">
        <div className="app-row app-row-head">
          <span>Company</span>
          <span>Role</span>
          <span>Status</span>
          <span>Applied</span>
        </div>
        {applications.map((app) => (
          <Link to={`/applications/${app.id}`} key={app.id} className="app-row">
            <span className="app-company">{app.company}</span>
            <span>{app.role}</span>
            <span className={statusClass(app.status)}>{app.status}</span>
            <span>{app.applied_date}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ApplicationsPage