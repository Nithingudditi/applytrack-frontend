import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">ApplyTrack</div>
        <nav className="sidebar-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/resumes">Resumes</Link>
          <Link to="/insights">Insights</Link>
        </nav>
        <button className="sidebar-logout" onClick={logout}>Log out</button>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}

export default Layout