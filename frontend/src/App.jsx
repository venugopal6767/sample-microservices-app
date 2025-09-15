import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'

function isLogged(){ return !!localStorage.getItem('token') }

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isLogged() ? '/dashboard' : '/login'} />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={ isLogged() ? <Dashboard/> : <Navigate to='/login'/> } />
    </Routes>
  )
}
