const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const router = express.Router();

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    let user;

    if (role === 'student') {
      user = await Student.findOne({ rollNo: identifier });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ email: identifier });
    }

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    res.json({ success: true, message: 'Login successful', role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- REGISTER STUDENT ---
router.post('/register/student', async (req, res) => {
  const { rollNo, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const student = new Student({ rollNo, password: hash });
  await student.save();
  res.json({ success: true, message: 'Student registered' });
});

// --- REGISTER TEACHER ---
router.post('/register/teacher', async (req, res) => {
  const { email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const teacher = new Teacher({ email, password: hash, role });
  await teacher.save();
  res.json({ success: true, message: 'Teacher registered' });
});

module.exports = router;
