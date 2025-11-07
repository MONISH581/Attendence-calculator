
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendanceApp";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(console.error);

// --- INSERT THIS BLOCK BEFORE STATIC FILE MIDDLEWARE ---
app.get('/', (req, res) => {
  // Redirect root path to the login page
  res.redirect('/login.html');
});
// ------------------------------------------------------

// Static files (leave public as is)
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
