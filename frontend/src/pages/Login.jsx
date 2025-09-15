import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    }catch(e){ alert(e.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} /><br/><br/>
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/><br/>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
