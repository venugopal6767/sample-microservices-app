import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      await axios.post('/api/auth/register', { username, password })
      alert('Registered - please login')
      navigate('/login')
    }catch(e){ alert(e.response?.data?.error || 'Register failed') }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={submit}>
          <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} /><br/><br/>
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/><br/>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}
