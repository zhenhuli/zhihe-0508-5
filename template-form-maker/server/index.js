const express = require('express');
const sqlite3 = require('better-sqlite3');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'forms.db');
const db = sqlite3(dbPath);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueName = `${Date.now()}_${uuidv4().slice(0, 8)}_${originalName}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

db.exec(`
  CREATE TABLE IF NOT EXISTS forms (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    fields TEXT NOT NULL,
    share_code TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL,
    data TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id)
  );
`);

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'));
});

app.get('/builder', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/my-forms', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/my-forms.html'));
});

app.get('/form/:shareCode', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/form-view.html'));
});

app.get('/submissions/:shareCode', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/submissions.html'));
});

app.get('/api/forms', (req, res) => {
  try {
    const forms = db.prepare(`
      SELECT id, title, description, share_code, created_at,
             (SELECT COUNT(*) FROM submissions WHERE form_id = forms.id) as submission_count
      FROM forms
      ORDER BY created_at DESC
    `).all();
    
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

app.post('/api/forms', (req, res) => {
  try {
    const { title, description, fields } = req.body;
    
    if (!title || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'Title and fields are required' });
    }
    
    const id = uuidv4();
    const shareCode = uuidv4().slice(0, 8);
    
    db.prepare(`
      INSERT INTO forms (id, title, description, fields, share_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, description || '', JSON.stringify(fields), shareCode);
    
    res.json({ id, shareCode });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

app.get('/api/forms/:shareCode', (req, res) => {
  try {
    const form = db.prepare(`
      SELECT id, title, description, fields, share_code, created_at
      FROM forms WHERE share_code = ?
    `).get(req.params.shareCode);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    form.fields = JSON.parse(form.fields);
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    const encodedFilename = encodeURIComponent(req.file.filename);
    
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: originalName,
      url: `/uploads/${encodedFilename}`,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.post('/api/forms/:shareCode/submit', (req, res) => {
  try {
    const form = db.prepare('SELECT id, fields FROM forms WHERE share_code = ?').get(req.params.shareCode);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const fields = JSON.parse(form.fields);
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Form data is required' });
    }
    
    for (const field of fields) {
      if (field.required && !data[field.id]) {
        return res.status(400).json({ error: `Field "${field.label}" is required` });
      }
      
      if (field.type === 'radio' && field.required && !data[field.id]) {
        return res.status(400).json({ error: `Field "${field.label}" is required` });
      }
      
      if (field.type === 'checkbox' && field.required) {
        const values = data[field.id];
        if (!values || (Array.isArray(values) && values.length === 0)) {
          return res.status(400).json({ error: `Field "${field.label}" is required` });
        }
      }
    }
    
    const id = uuidv4();
    db.prepare(`
      INSERT INTO submissions (id, form_id, data)
      VALUES (?, ?, ?)
    `).run(id, form.id, JSON.stringify(data));
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

app.get('/api/forms/:shareCode/submissions', (req, res) => {
  try {
    const form = db.prepare('SELECT id, fields, title FROM forms WHERE share_code = ?').get(req.params.shareCode);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const submissions = db.prepare(`
      SELECT id, data, submitted_at
      FROM submissions
      WHERE form_id = ?
      ORDER BY submitted_at DESC
    `).all(form.id);
    
    const parsedSubmissions = submissions.map(sub => ({
      ...sub,
      data: JSON.parse(sub.data)
    }));
    
    res.json({
      form: {
        ...form,
        fields: JSON.parse(form.fields)
      },
      submissions: parsedSubmissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.delete('/api/forms/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM submissions WHERE form_id = ?').run(req.params.id);
    const result = db.prepare('DELETE FROM forms WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
