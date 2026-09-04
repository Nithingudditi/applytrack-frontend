import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const doLogin = async (u, p) => {
    setError('')
    try {
      const response = await api.post('/token/', { username: u, password: p })
      login(response.data.access, response.data.refresh)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doLogin(username, password)
  }

  const handleDemo = () => {
    doLogin('demo', 'demo12345')
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">ApplyTrack</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Log in</button>
        </form>
        <button onClick={handleDemo} className="btn btn-outline" style={{ width: '100%', marginTop: '0.75rem' }}>
          Try the demo
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage