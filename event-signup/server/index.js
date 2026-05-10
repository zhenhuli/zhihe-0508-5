const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([]));
}

const readEvents = () => {
  try {
    return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const writeEvents = (events) => {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
};

const readRegistrations = () => {
  try {
    return JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const writeRegistrations = (registrations) => {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

const isEventClosed = (event) => {
  const now = new Date();
  const deadline = new Date(event.registrationDeadline);
  return now > deadline || event.currentParticipants >= event.maxParticipants;
};

const sanitizeEvent = (event, includeSensitive = false) => {
  const sanitized = {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    date: event.date,
    maxParticipants: event.maxParticipants,
    registrationDeadline: event.registrationDeadline,
    currentParticipants: event.currentParticipants,
    createdAt: event.createdAt,
    isClosed: isEventClosed(event)
  };
  return sanitized;
};

app.get('/api/events', (req, res) => {
  const events = readEvents().map(event => sanitizeEvent(event));
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const events = readEvents();
  const event = events.find(e => e.id === parseInt(req.params.id));
  
  if (!event) {
    return res.status(404).json({ error: '活动不存在' });
  }
  
  const response = sanitizeEvent(event);
  response.registrations = [];
  
  res.json(response);
});

app.post('/api/events', (req, res) => {
  const { title, description, location, date, maxParticipants, registrationDeadline, adminPassword } = req.body;
  
  if (!title || !date || !maxParticipants || !registrationDeadline || !adminPassword) {
    return res.status(400).json({ error: '缺少必要字段，请填写管理密码' });
  }
  
  if (adminPassword.length < 4) {
    return res.status(400).json({ error: '管理密码至少4位' });
  }
  
  const events = readEvents();
  const newEvent = {
    id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
    title,
    description: description || '',
    location: location || '',
    date,
    maxParticipants: parseInt(maxParticipants),
    registrationDeadline,
    adminPassword: hashPassword(adminPassword),
    currentParticipants: 0,
    createdAt: new Date().toISOString()
  };
  
  events.push(newEvent);
  writeEvents(events);
  
  const response = sanitizeEvent(newEvent);
  response.adminPasswordSet = true;
  
  res.status(201).json(response);
});

app.post('/api/events/:id/verify-admin', (req, res) => {
  const events = readEvents();
  const event = events.find(e => e.id === parseInt(req.params.id));
  
  if (!event) {
    return res.status(404).json({ error: '活动不存在' });
  }
  
  const { adminPassword } = req.body;
  
  if (!adminPassword) {
    return res.status(400).json({ error: '请输入管理密码' });
  }
  
  if (!verifyPassword(adminPassword, event.adminPassword)) {
    return res.status(401).json({ error: '管理密码错误' });
  }
  
  res.json({ success: true });
});

app.post('/api/events/:id/register', (req, res) => {
  const events = readEvents();
  const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: '活动不存在' });
  }
  
  const event = events[eventIndex];
  
  if (isEventClosed(event)) {
    return res.status(400).json({ error: '活动报名已结束' });
  }
  
  const { name, email, phone, note } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: '缺少必要报名信息' });
  }
  
  const registrations = readRegistrations();
  
  const existingRegistration = registrations.find(
    r => r.eventId === event.id && (r.email === email || r.phone === phone)
  );
  
  if (existingRegistration) {
    return res.status(400).json({ error: '您已报名此活动' });
  }
  
  const newRegistration = {
    id: registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 1,
    eventId: event.id,
    name,
    email,
    phone,
    note: note || '',
    registeredAt: new Date().toISOString()
  };
  
  registrations.push(newRegistration);
  writeRegistrations(registrations);
  
  events[eventIndex].currentParticipants++;
  writeEvents(events);
  
  res.status(201).json({ success: true, message: '报名成功' });
});

app.post('/api/events/:id/registrations', (req, res) => {
  const events = readEvents();
  const event = events.find(e => e.id === parseInt(req.params.id));
  
  if (!event) {
    return res.status(404).json({ error: '活动不存在' });
  }
  
  const { adminPassword } = req.body;
  
  if (!adminPassword) {
    return res.status(400).json({ error: '请输入管理密码' });
  }
  
  if (!verifyPassword(adminPassword, event.adminPassword)) {
    return res.status(401).json({ error: '管理密码错误' });
  }
  
  const registrations = readRegistrations().filter(r => r.eventId === event.id);
  res.json(registrations);
});

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});
