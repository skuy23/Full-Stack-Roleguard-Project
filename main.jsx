import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './AuthContext'
import App from './App'
import Login from './pages/Login'
import AdminUsers from './pages/AdminUsers'
import ProtectedRoute from './ProtectedRoute'
import Projects from './pages/Projects'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/' element={<ProtectedRoute><App/></ProtectedRoute>} />
          <Route path='/projects' element={<ProtectedRoute><Projects/></ProtectedRoute>} />
          <Route path='/admin/users' element={<ProtectedRoute roles={['ADMIN'] }><AdminUsers/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
