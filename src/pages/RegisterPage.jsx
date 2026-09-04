import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register/', { username, email, password })
      const tokenRes = await api.post('/token/', { username, password })
      login(tokenRes.data.access, tokenRes.data.refresh)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      setError(data?.username?.[0] || data?.password?.[0] || 'Registration failed')
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">ApplyTrack</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Create account</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage