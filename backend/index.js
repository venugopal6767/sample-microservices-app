import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';
import client from 'prom-client';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'todoapp',
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const totalRequests = new client.Counter({ name: 'todoapp_requests_total', help: 'Total API requests' });
const signups = new client.Counter({ name: 'todoapp_user_signups_total', help: 'Total user signups' });
const logins = new client.Counter({ name: 'todoapp_user_logins_total', help: 'Total user logins' });
const eventsCreated = new client.Counter({ name: 'todoapp_events_created_total', help: 'Total events created' });
const tasksCreated = new client.Counter({ name: 'todoapp_tasks_created_total', help: 'Total tasks created' });

register.registerMetric(totalRequests);
register.registerMetric(signups);
register.registerMetric(logins);
register.registerMetric(eventsCreated);
register.registerMetric(tasksCreated);

// simple structured logger to stdout (JSON)
function log(obj){
  console.log(JSON.stringify(obj));
}

// middleware count requests
app.use((req,res,next)=>{
  totalRequests.inc();
  res.on('finish', ()=>{
    log({ ts: Date.now(), method: req.method, path: req.path, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req,res)=>{
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// auth and user routes
app.post('/api/auth/register', async (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'username+password required' });
  const hash = await bcrypt.hash(password, 10);
  try{
    await pool.query('INSERT INTO users(username,password_hash) VALUES($1,$2)', [username, hash]);
    signups.inc();
    log({ event: 'signup', user: username });
    res.json({ message: 'ok' });
  }catch(e){
    res.status(400).json({ error: 'user exists' });
  }
});

app.post('/api/auth/login', async (req,res)=>{
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
  if(result.rowCount===0) return res.status(400).json({ error: 'user not found' });
  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(400).json({ error: 'wrong password' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
  log({ event: 'login', user: username });
  logins.inc();
  res.json({ token });
});

// auth middleware
function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error: 'no token' });
  const token = h.split(' ')[1];
  try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  }catch(e){ res.status(403).json({ error: 'invalid token' }); }
}

// events/tasks
app.get('/api/events', auth, async (req,res)=>{
  const r = await pool.query('SELECT id, title FROM events WHERE user_id=$1 ORDER BY id DESC', [req.user.id]);
  res.json(r.rows);
});

app.post('/api/events', auth, async (req,res)=>{
  const { title } = req.body;
  const r = await pool.query('INSERT INTO events(title,user_id) VALUES($1,$2) RETURNING id, title', [title, req.user.id]);
  eventsCreated.inc();
  log({ event: 'event_created', user: req.user.username, title });
  res.json(r.rows[0]);
});

app.get('/api/tasks', auth, async (req,res)=>{
  const event_id = req.query.event_id;
  const r = await pool.query('SELECT id,title,completed FROM tasks WHERE event_id=$1', [event_id]);
  res.json(r.rows);
});

app.post('/api/tasks', auth, async (req,res)=>{
  const { title, event_id } = req.body;
  const r = await pool.query('INSERT INTO tasks(title,event_id) VALUES($1,$2) RETURNING id,title,completed', [title, event_id]);
  tasksCreated.inc();
  log({ event: 'task_created', user: req.user.username, title, event_id });
  res.json(r.rows[0]);
});

// start
app.listen(3000, ()=> console.log('Backend running on port 3000'));
