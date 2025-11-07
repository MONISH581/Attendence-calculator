const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Mark attendance
router.post("/mark", async (req, res) => {
  const { studentId, status, date, subject } = req.body;
  const s = await Student.findById(studentId);
  if(!s) return res.status(404).json({ message: "Student not found" });
  const d = date || new Date().toISOString().slice(0,10);

  // prevent duplicates for the same date (update if exists)
  const idx = s.attendance.findIndex(a => a.date === d && (!subject || a.subject === subject));
  if(idx >= 0){
    s.attendance[idx].status = status;
  } else {
    s.attendance.push({ date: d, status, subject });
  }
  await s.save();
  res.json({ ok: true, student: s });
});

// Basic summary
router.get("/summary", async (req, res) => {
  const list = await Student.find();
  const today = new Date().toISOString().slice(0,10);
  const summary = list.map(s => {
    const total = s.attendance.length;
    const present = s.attendance.filter(a => a.status === "Present").length;
    const todayMark = s.attendance.find(a => a.date === today)?.status || "Not Marked";
    const percentage = total ? Math.round((present/total)*100) : 0;
    return { id: s._id, name: s.name, rollNo: s.rollNo, className: s.className, percentage, today: todayMark };
  });
  res.json(summary);
});

module.exports = router;
