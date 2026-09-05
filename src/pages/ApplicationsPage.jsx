import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { STATUS_OPTIONS, statusClass } from '../utils/status'

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [resumes, setResumes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [appliedDate, setAppliedDate] = useState('')
  const [source, setSource] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [resumeId, setResumeId] = useState('')
  const [formError, setFormError] = useState('')

  const fetchApplications = () => {
    setLoading(true)
    const params = {}
    if (statusFilter) params.status = statusFilter
    if (sourceFilter) params.source = sourceFilter

    api.get('/applications/', { params })
      .then((response) => setApplications(response.data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, sourceFilter])

  useEffect(() => {
    api.get('/resumes/').then((res) => setResumes(res.data)).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      await api.post('/applications/', {
        company,
        role,
        applied_date: appliedDate,
        source,
        job_url: jobUrl,
        salary_range: salaryRange,
        resume: resumeId || null,
      })
      setCompany('')
      setRole('')
      setAppliedDate('')
      setSource('')
      setJobUrl('')
      setSalaryRange('')
      setResumeId('')
      fetchApplications()
    } catch (err) {
      setFormError('Failed to create application')
    }
  }

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
        <div className="field">
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">—</option>
            <option value="linkedin">LinkedIn</option>
            <option value="referral">Referral</option>
            <option value="company_site">Company site</option>
            <option value="job_board">Job board</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field">
          <label>Job URL</label>
          <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://…" />
        </div>
        <div className="field">
          <label>Salary range</label>
          <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="e.g. 6-8 LPA" />
        </div>
        <div className="field">
          <label>Resume used</label>
          <select value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
            <option value="">—</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.label || `Resume #${r.id}`}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      {formError && <p className="form-error">{formError}</p>}

      <div className="field-row" style={{ marginTop: '0.5rem' }}>
        <div className="field">
          <label>Filter by status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Filter by source</label>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="">All</option>
            <option value="linkedin">LinkedIn</option>
            <option value="referral">Referral</option>
            <option value="company_site">Company site</option>
            <option value="job_board">Job board</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="app-list">
          <div className="app-row app-row-head">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Applied</span>
          </div>
          {applications.length === 0 ? (
            <p style={{ padding: '1rem 0', color: 'var(--ink-soft)' }}>No applications match this filter.</p>
          ) : (
            applications.map((app) => (
              <Link to={`/applications/${app.id}`} key={app.id} className="app-row">
                <span className="app-company">{app.company}</span>
                <span>{app.role}</span>
                <span className={statusClass(app.status)}>{app.status}</span>
                <span>{app.applied_date}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ApplicationsPage