const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  subject: { type: String }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  password: { type: String, required: true },
  batchStartYear: { type: Number },
  subjects: { type: [String], default: [] }, // <--- Added for filtering subjects
  attendance: { type: [attendanceSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
