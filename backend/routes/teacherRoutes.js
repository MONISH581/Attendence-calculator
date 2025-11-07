const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// List teachers
router.get("/", async (req, res) => {
  const list = await Teacher.find().sort({ createdAt: -1 });
  res.json(list);
});

// Create teacher (admin panel)
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required" });
  try {
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    const teacher = await Teacher.create({ name, email, password, role });
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Failed to create teacher", error: err.message });
  }
});

// Login teacher
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ success: true, userId: teacher._id, role: teacher.role, name: teacher.name });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Delete teacher
router.delete("/:id", async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
