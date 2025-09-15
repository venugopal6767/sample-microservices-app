import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

axios.interceptors.request.use(cfg=>{
  const t = localStorage.getItem('token')
  if(t) cfg.headers['Authorization'] = `Bearer ${t}`
  return cfg
})

export default function Dashboard(){
  const [tasks,setTasks]=useState([])
  const [title,setTitle]=useState('')
  const navigate = useNavigate()

  useEffect(()=>{ fetchTasks() }, [])

  async function fetchTasks(){
    try{
      const res = await axios.get('/api/tasks')
      setTasks(res.data)
    }catch(e){ if(e.response?.status===401){ localStorage.removeItem('token'); navigate('/login') } }
  }
  async function addTask(e){
    e.preventDefault()
    if(!title) return
    await axios.post('/api/tasks',{ title })
    setTitle(''); fetchTasks()
  }
  async function toggle(id, completed){
    await axios.put(`/api/tasks/${id}`, { completed: !completed })
    fetchTasks()
  }
  async function removeTask(id){
    await axios.delete(`/api/tasks/${id}`)
    fetchTasks()
  }
  function logout(){ localStorage.removeItem('token'); navigate('/login') }

  return (
    <div className="container">
      <div className="header card">
        <h2>Todo Dashboard</h2>
        <div>
          <button onClick={logout} style={{background:'#ef4444',color:'white',padding:8,borderRadius:6,border:'none'}}>Logout</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <form onSubmit={addTask} style={{display:'flex', gap:8}}>
          <input placeholder="New task" value={title} onChange={e=>setTitle(e.target.value)} style={{flex:1}} />
          <button type="submit" style={{background:'#2563eb',color:'white',padding:8,borderRadius:6,border:'none'}}>Add</button>
        </form>
        <ul style={{marginTop:12}}>
          {tasks.map(t=> (
            <li key={t.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:8, borderBottom:'1px solid #eee'}}>
              <div>
                <input type="checkbox" checked={t.completed} onChange={()=>toggle(t.id,t.completed)} /> <span style={{marginLeft:8, textDecoration: t.completed ? 'line-through' : 'none'}}>{t.title}</span>
              </div>
              <div>
                <button onClick={()=>removeTask(t.id)} style={{background:'#ef4444',color:'white',padding:6,borderRadius:6,border:'none'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
