// backend/server.js (or index.js) - updated
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// --- CORS: allow deployed frontend OR local dev ---
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'https://attendence-calculator-wjwm.vercel.app';
const DEV_ORIGIN = 'http://localhost:3000'; // if you serve frontend locally during dev

const allowedOrigins = [FRONTEND_ORIGIN, DEV_ORIGIN];

// Dynamic origin check (safer than '*')
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g., mobile apps, curl, same-origin requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS blocked by server - origin not allowed: ' + origin));
    }
  },
  credentials: true, // allow cookies if you use them
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendanceApp";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    // do NOT exit in production automatically — let hosting show crash logs if needed
  });

// Optional root redirect to login page in /public
app.get('/', (req, res) => {
  return res.redirect('/login.html');
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// static files
app.use(express.static(path.join(__dirname, "..", "public")));

// routes (keep your existing route files)
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// catch-all for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
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
