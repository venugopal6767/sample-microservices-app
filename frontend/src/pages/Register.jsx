import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [success,setSuccess] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(''); setSuccess('')
    try{
      await axios.post('/api/auth/register', { username, password })
      setSuccess('🎉 Registration successful! Redirecting to login...')
      setTimeout(()=> navigate('/login'), 1800)
    }catch(err){ setError(err.response?.data?.error || 'Register failed') }
  }

  return (
    <div className="center">
      <div className="card" style={{width:360}}>
        <h2 style={{textAlign:'center'}}>Create Account</h2>
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:12}}>
          {error && <div style={{background:'#fee',padding:8,borderRadius:6,color:'#900'}}>{error}</div>}
          {success && <div style={{background:'#efe',padding:8,borderRadius:6,color:'#060'}}>{success}</div>}
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" style={{background:'#059669',color:'white',padding:10,borderRadius:6,border:'none'}}>Register</button>
        </form>
      </div>
    </div>
  )
}
