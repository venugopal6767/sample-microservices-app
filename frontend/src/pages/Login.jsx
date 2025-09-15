import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('/api/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="center">
      <div className="card" style={{width:360}}>
        <h2 style={{textAlign:'center'}}>Welcome Back</h2>
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:12}}>
          {error && <div style={{background:'#fee',padding:8,borderRadius:6,color:'#900'}}>{error}</div>}
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" style={{background:'#2563eb',color:'white',padding:10,borderRadius:6,border:'none'}}>Login</button>
        </form>
        <p style={{textAlign:'center',marginTop:12}}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
