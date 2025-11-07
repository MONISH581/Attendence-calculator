const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// List admins
router.get("/", async (req, res) => {
  const list = await Admin.find().sort({ createdAt: -1 });
  res.json(list);
});

// Create admin/superadmin
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });
  const admin = await Admin.create({ name, email, password, role });
  res.status(201).json(admin);
});

// Login admin/superadmin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  if (admin.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({ success: true, userId: admin._id, role: admin.role, name: admin.name });
});

// Delete admin
router.delete("/:id", async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
