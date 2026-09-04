import { useEffect, useState } from 'react'
import api from '../api/axios'

function ResumesPage() {
  const [resumes, setResumes] = useState([])
  const [file, setFile] = useState(null)
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const fetchResumes = () => {
    api.get('/resumes/').then((res) => setResumes(res.data)).catch(() => setError('Failed to load resumes'))
  }

  useEffect(() => { fetchResumes() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('label', label)
    try {
      await api.post('/resumes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFile(null)
      setLabel('')
      fetchResumes()
    } catch (err) {
      setError('Failed to upload resume')
    }
  }

  return (
    <div>
      <h1>Resumes</h1>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleUpload} className="field-row">
        <div className="field">
          <label>File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <div className="field">
          <label>Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Backend v2" />
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
      <ul className="list-plain">
        {resumes.map((r) => (
          <li key={r.id}>
            <a href={r.file} target="_blank" rel="noreferrer">{r.label || 'Resume'}</a> — {new Date(r.uploaded_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ResumesPage