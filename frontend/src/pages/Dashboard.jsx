import { useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.headers.common['Authorization'] = () => `Bearer ${localStorage.getItem('token')}`

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(()=>{ fetchEvents() }, [])

  async function fetchEvents(){
    const res = await axios.get('/api/events')
    setEvents(res.data)
  }
  async function addEvent(e){
    e.preventDefault()
    await axios.post('/api/events', { title })
    setTitle(''); fetchEvents()
  }
  async function fetchTasks(evId){
    setSelectedEvent(evId)
    const res = await axios.get(`/api/tasks?event_id=${evId}`)
    setTasks(res.data)
  }
  async function addTask(e){
    e.preventDefault()
    await axios.post('/api/tasks', { title: taskTitle, event_id: selectedEvent })
    setTaskTitle(''); fetchTasks(selectedEvent)
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <form onSubmit={addEvent}>
          <input placeholder="Event title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button type="submit">Add Event</button>
        </form>
        <ul>
          {events.map(ev => (
            <li key={ev.id}>
              <span onClick={()=>fetchTasks(ev.id)} style={{cursor:'pointer'}}>{ev.title}</span>
            </li>
          ))}
        </ul>
        {selectedEvent && (
          <div>
            <h3>Tasks</h3>
            <form onSubmit={addTask}>
              <input placeholder="Task title" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} />
              <button type="submit">Add Task</button>
            </form>
            <ul>
              {tasks.map(t => <li key={t.id}>{t.title} - {t.completed ? 'done' : 'todo'}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
