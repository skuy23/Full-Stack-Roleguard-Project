import React, { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from './AuthContext'

export default function Layout({ children }){
  const { user, logout } = useContext(AuthContext)
  const [collapsed, setCollapsed] = useState(()=> {
    try{ return JSON.parse(localStorage.getItem('ui.collapsed')||'false') }catch{ return false }
  })
  useEffect(()=>{ localStorage.setItem('ui.collapsed', JSON.stringify(collapsed)) },[collapsed])
  return (<div>
    <nav className="navbar navbar-expand-lg bg-body-tertiary rounded mb-3">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Fullstack</NavLink>
        <button className="btn btn-sm btn-outline-secondary" onClick={()=>setCollapsed(c=>!c)}>
          {collapsed? 'Expand' : 'Collapse'}
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/projects">Projects</NavLink></li>
            {user?.role === 'ADMIN' && <li className="nav-item"><NavLink className="nav-link" to="/admin/users">Admin</NavLink></li>}
          </ul>
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
          <div className="text-muted">{user?.role}</div>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
    <div className="container">{children}</div>
  </div>)
}
