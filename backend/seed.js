// backend/seed.js - updated
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Admin = require("./models/Admin");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendanceApp";

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected for seeding");

    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Admin.deleteMany({});

    const students = await Student.insertMany([
      { name: "Monish R", rollNo: "CSE24A001", className: "CSE-A", batchStartYear: 2024, subjects: ["Maths", "DSA", "OOPS"], password: "monishpass" },
      { name: "Ananya S", rollNo: "CSE24A002", className: "CSE-A", batchStartYear: 2024, subjects: ["Maths", "DSA"], password: "ananyapass" },
      { name: "Vikram K", rollNo: "CSE24B003", className: "CSE-B", batchStartYear: 2024, subjects: ["DSA", "OOPS"], password: "vikrampass" },
      { name: "Priya D", rollNo: "ECE24A004", className: "ECE-A", batchStartYear: 2024, subjects: ["Maths", "OOPS"], password: "priyapass" },
      { name: "Rahul M", rollNo: "MECH24C005", className: "MECH-C", batchStartYear: 2024, subjects: ["Maths"], password: "rahulpass" }
    ]);

    const teachers = await Teacher.insertMany([
      { name: "Mrs. Lakshmi", email: "lakshmi@college.edu", password: "lakshmipass" },
      { name: "Mr. Arjun", email: "arjun@college.edu", password: "arjunpass" }
    ]);

    const admins = await Admin.insertMany([
      { name: "Head Admin", email: "admin@college.edu", password: "adminpass", role: "admin" },
      { name: "Super Admin", email: "super@college.edu", password: "superpass", role: "superadmin" }
    ]);

    console.log("Seeded:", { students: students.length, teachers: teachers.length, admins: admins.length });

  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Mongo disconnected after seeding");
  }
}

run();
