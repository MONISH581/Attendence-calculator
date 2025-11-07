const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// List students
router.get("/", async (req, res) => {
  const list = await Student.find().sort({ createdAt: -1 });
  res.json(list);
});

// Get single student
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Not found" });
  res.json(student);
});

// Create student (registration/admin)
router.post("/", async (req, res) => {
  const { name, rollNo, className, password, batchStartYear } = req.body;
  if (!name || !rollNo || !className || !password) {
    return res.status(400).json({ message: "Name, rollNo, className, and password are required" });
  }
  try {
    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: "Roll number already exists" });
    let inferredBatch = batchStartYear;
    if (!inferredBatch && rollNo) {
      const match = String(rollNo).match(/(\d{2})/);
      if (match && match[1]) inferredBatch = 2000 + parseInt(match[1], 10);
    }
    const student = await Student.create({ name, rollNo, className, password, batchStartYear: inferredBatch });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error creating student", error: err.message });
  }
});

// Login student
router.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;
  if (!rollNo || !password)
    return res.status(400).json({ message: "Roll number and password are required" });
  try {
    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ success: true, userId: student._id, role: "student", name: student.name });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

// Delete student
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Dashboard route with overall and per-subject attendance stats
router.get("/dashboard/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const totalDays = student.attendance.length;
  const presentDays = student.attendance.filter(a => a.status === "Present").length;
  const overallPercentage = totalDays ? Math.round(presentDays / totalDays * 100) : 0;

  const subjectMap = {};
  student.attendance.forEach(a => {
    if (!a.subject) return;
    if (!subjectMap[a.subject]) subjectMap[a.subject] = { total: 0, present: 0 };
    subjectMap[a.subject].total += 1;
    if (a.status === "Present") subjectMap[a.subject].present += 1;
  });

  const perSubject = Object.entries(subjectMap).map(([subject, stats]) => ({
    subject,
    present: stats.present,
    total: stats.total,
    percentage: stats.total ? Math.round(stats.present / stats.total * 100) : 0
  }));

  res.json({
    name: student.name,
    rollNo: student.rollNo,
    className: student.className,
    attendance: student.attendance,
    overallPercentage,
    presentDays,
    totalDays,
    perSubject
  });
});

module.exports = router;
