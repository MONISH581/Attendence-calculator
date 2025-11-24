require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// --- SET CORS FOR YOUR DEPLOYED FRONTEND ---
app.use(
  cors({
    origin: "https://attendence-calculator-wjwm.vercel.app",
    credentials: true, // Only needed if you use cookies/auth
  })
);
// --------------------------------------------

app.use(express.json());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendanceApp";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// --- Redirect root to login page ---
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
