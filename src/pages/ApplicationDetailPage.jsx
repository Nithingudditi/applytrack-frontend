import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { STATUS_OPTIONS, statusClass } from '../utils/status'

const OUTCOME_OPTIONS = ['pending', 'passed', 'failed']

function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [contacts, setContacts] = useState([])
  const [interviews, setInterviews] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [resumes, setResumes] = useState([])
  const [error, setError] = useState('')

  const [editing, setEditing] = useState(false)
  const [editCompany, setEditCompany] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editSource, setEditSource] = useState('')
  const [editJobUrl, setEditJobUrl] = useState('')
  const [editSalaryRange, setEditSalaryRange] = useState('')
  const [editResumeId, setEditResumeId] = useState('')

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [roundType, setRoundType] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  const fetchAll = async () => {
    try {
      const [appRes, contactsRes, interviewsRes, historyRes, resumesRes] = await Promise.all([
        api.get(`/applications/${id}/`),
        api.get(`/applications/${id}/contacts/`),
        api.get(`/applications/${id}/interviews/`),
        api.get(`/applications/${id}/status-history/`),
        api.get('/resumes/'),
      ])
      setApplication(appRes.data)
      setContacts(contactsRes.data)
      setInterviews(interviewsRes.data)
      setStatusHistory(historyRes.data)
      setResumes(resumesRes.data)
    } catch (err) {
      setError('Failed to load application details')
    }
  }

  useEffect(() => { fetchAll() }, [id])

  const startEditing = () => {
    setEditCompany(application.company)
    setEditRole(application.role)
    setEditSource(application.source || '')
    setEditJobUrl(application.job_url || '')
    setEditSalaryRange(application.salary_range || '')
    setEditResumeId(application.resume || '')
    setEditing(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/applications/${id}/`, {
        company: editCompany,
        role: editRole,
        source: editSource,
        job_url: editJobUrl,
        salary_range: editSalaryRange,
        resume: editResumeId || null,
      })
      setEditing(false)
      fetchAll()
    } catch (err) {
      setError('Failed to save changes')
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/applications/${id}/`, { status: newStatus })
      fetchAll()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return
    try {
      await api.delete(`/applications/${id}/`)
      navigate('/applications')
    } catch (err) {
      setError('Failed to delete application')
    }
  }

  const handleAddContact = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/applications/${id}/contacts/`, { name: contactName, email: contactEmail })
      setContactName('')
      setContactEmail('')
      fetchAll()
    } catch (err) {
      setError('Failed to add contact')
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Delete this contact?')) return
    try {
      await api.delete(`/applications/${id}/contacts/${contactId}/`)
      fetchAll()
    } catch (err) {
      setError('Failed to delete contact')
    }
  }

  const handleAddInterview = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/applications/${id}/interviews/`, { round_type: roundType, scheduled_date: scheduledDate })
      setRoundType('')
      setScheduledDate('')
      fetchAll()
    } catch (err) {
      setError('Failed to add interview')
    }
  }

  const handleOutcomeChange = async (interviewId, newOutcome) => {
    try {
      await api.patch(`/applications/${id}/interviews/${interviewId}/`, { outcome: newOutcome })
      fetchAll()
    } catch (err) {
      setError('Failed to update outcome')
    }
  }

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Delete this interview?')) return
    try {
      await api.delete(`/applications/${id}/interviews/${interviewId}/`)
      fetchAll()
    } catch (err) {
      setError('Failed to delete interview')
    }
  }

  if (!application) return <p>Loading…</p>

  return (
    <div>
      {!editing ? (
        <>
          <h1>{application.role} — {application.company}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            {application.source && <>Source: {application.source} · </>}
            {application.salary_range && <>Salary: {application.salary_range} · </>}
            {application.job_url && <><a href={application.job_url} target="_blank" rel="noreferrer">Job posting</a> · </>}
            {application.resume_detail
              ? <>Resume: <a href={application.resume_detail.file} target="_blank" rel="noreferrer">{application.resume_detail.label || 'view'}</a></>
              : <>Resume: none linked</>}
          </p>
          <button onClick={startEditing} className="btn btn-outline">Edit details</button>
        </>
      ) : (
        <form onSubmit={handleSaveEdit}>
          <h2>Edit application</h2>
          <div className="field-row">
            <div className="field">
              <label>Company</label>
              <input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} required />
            </div>
            <div className="field">
              <label>Role</label>
              <input value={editRole} onChange={(e) => setEditRole(e.target.value)} required />
            </div>
            <div className="field">
              <label>Source</label>
              <select value={editSource} onChange={(e) => setEditSource(e.target.value)}>
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
              <input value={editJobUrl} onChange={(e) => setEditJobUrl(e.target.value)} />
            </div>
            <div className="field">
              <label>Salary range</label>
              <input value={editSalaryRange} onChange={(e) => setEditSalaryRange(e.target.value)} />
            </div>
            <div className="field">
              <label>Resume used</label>
              <select value={editResumeId} onChange={(e) => setEditResumeId(e.target.value)}>
                <option value="">—</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.label || `Resume #${r.id}`}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>{' '}
          <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="field-row" style={{ marginTop: '1.5rem' }}>
        <div className="field">
          <label>Status</label>
          <select value={application.status} onChange={(e) => handleStatusChange(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span className={statusClass(application.status)}>{application.status}</span>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
      </div>

      <h2>Contacts</h2>
      <ul className="list-plain">
        {contacts.map((c) => (
          <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{c.name} — {c.email}</span>
            <button onClick={() => handleDeleteContact(c.id)} className="btn btn-danger" style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}>Remove</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddContact} className="field-row">
        <div className="field"><label>Name</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} required /></div>
        <div className="field"><label>Email</label><input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
        <button type="submit" className="btn btn-outline">Add contact</button>
      </form>

      <h2>Interviews</h2>
      <ul className="list-plain">
        {interviews.map((i) => (
          <li key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i.round_type} — {i.scheduled_date}</span>
            <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select value={i.outcome} onChange={(e) => handleOutcomeChange(i.id, e.target.value)}>
                {OUTCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <button onClick={() => handleDeleteInterview(i.id)} className="btn btn-danger" style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}>Remove</button>
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddInterview} className="field-row">
        <div className="field"><label>Round type</label><input value={roundType} onChange={(e) => setRoundType(e.target.value)} required /></div>
        <div className="field"><label>Scheduled</label><input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required /></div>
        <button type="submit" className="btn btn-outline">Add interview</button>
      </form>

      <h2>Status history</h2>
      <ul className="timeline">
        {statusHistory.map((h) => (
          <li key={h.id}>{h.old_status || 'created'} → {h.new_status} — {new Date(h.changed_at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  )
}

export default ApplicationDetailPage