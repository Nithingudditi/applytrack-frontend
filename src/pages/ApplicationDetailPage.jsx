import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { STATUS_OPTIONS, statusClass } from '../utils/status'

function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [contacts, setContacts] = useState([])
  const [interviews, setInterviews] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [error, setError] = useState('')

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [roundType, setRoundType] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  const fetchAll = async () => {
    try {
      const [appRes, contactsRes, interviewsRes, historyRes] = await Promise.all([
        api.get(`/applications/${id}/`),
        api.get(`/applications/${id}/contacts/`),
        api.get(`/applications/${id}/interviews/`),
        api.get(`/applications/${id}/status-history/`),
      ])
      setApplication(appRes.data)
      setContacts(contactsRes.data)
      setInterviews(interviewsRes.data)
      setStatusHistory(historyRes.data)
    } catch (err) {
      setError('Failed to load application details')
    }
  }

  useEffect(() => { fetchAll() }, [id])

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

  if (!application) return <p>Loading…</p>

  return (
    <div>
      <h1>{application.role} — {application.company}</h1>
      {error && <p className="form-error">{error}</p>}

      <div className="field-row">
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
        {contacts.map((c) => <li key={c.id}>{c.name} — {c.email}</li>)}
      </ul>
      <form onSubmit={handleAddContact} className="field-row">
        <div className="field"><label>Name</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} required /></div>
        <div className="field"><label>Email</label><input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
        <button type="submit" className="btn btn-outline">Add contact</button>
      </form>

      <h2>Interviews</h2>
      <ul className="list-plain">
        {interviews.map((i) => <li key={i.id}>{i.round_type} — {i.scheduled_date} — {i.outcome}</li>)}
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