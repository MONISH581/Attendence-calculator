// backend/server.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('combined'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS: allow deployed frontend OR local dev ---
// Set FRONTEND_URL to your frontend origin (include https://) in the hosting env
// Default changed to the frontend URL you provided
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'https://attendence-calculator-git-main-monishs-projects-e702aa3f.vercel.app';
const DEV_ORIGIN = 'http://localhost:3000';
const allowedOrigins = [FRONTEND_ORIGIN, DEV_ORIGIN];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, same-origin requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS blocked by server - origin not allowed: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled quickly
app.options('*', cors(corsOptions));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendanceApp';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// root redirect to index (your login page is index.html)
app.get('/', (req, res) => res.redirect('/index.html'));

// health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// catch CORS errors and return useful message
app.use((err, req, res, next) => {
  if (err && err.message && err.message.indexOf('CORS') !== -1) {
    console.warn('CORS error:', err.message);
    return res.status(403).json({ error: 'CORS Error', message: err.message });
  }
  next(err);
});

// catch-all for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// SPA fallback — serve index for non-API paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Allowed FRONTEND origin: ${FRONTEND_ORIGIN}`);
  } else {
    console.log(`Dev FRONTEND_ORIGIN: ${DEV_ORIGIN}`);
  }
});
