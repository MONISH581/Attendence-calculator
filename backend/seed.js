// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendanceApp';
const SALT_ROUNDS = Number(process.env.SEED_BCRYPT_SALT_ROUNDS) || 10;

// Safety: avoid running in production by mistake unless explicitly allowed
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
  console.error('Refusing to run seeder in production. To override set ALLOW_SEED=true');
  process.exit(1);
}

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected for seeding');

    // Destructive: clear collections
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared Student/Teacher/Admin collections');

    const studentsRaw = [
      { name: 'Monish R', rollNo: 'CSE24A001', className: 'CSE-A', batchStartYear: 2024, subjects: ['Maths', 'DSA', 'OOPS'], password: 'monishpass' },
      { name: 'Ananya S', rollNo: 'CSE24A002', className: 'CSE-A', batchStartYear: 2024, subjects: ['Maths', 'DSA'], password: 'ananyapass' },
      { name: 'Vikram K', rollNo: 'CSE24B003', className: 'CSE-B', batchStartYear: 2024, subjects: ['DSA', 'OOPS'], password: 'vikrampass' },
      { name: 'Priya D', rollNo: 'ECE24A004', className: 'ECE-A', batchStartYear: 2024, subjects: ['Maths', 'OOPS'], password: 'priyapass' },
      { name: 'Rahul M', rollNo: 'MECH24C005', className: 'MECH-C', batchStartYear: 2024, subjects: ['Maths'], password: 'rahulpass' }
    ];

    const teachersRaw = [
      { name: 'Mrs. Lakshmi', email: 'lakshmi@college.edu', password: 'lakshmipass' },
      { name: 'Mr. Arjun', email: 'arjun@college.edu', password: 'arjunpass' }
    ];

    const adminsRaw = [
      { name: 'Head Admin', email: 'admin@college.edu', password: 'adminpass', role: 'admin' },
      { name: 'Super Admin', email: 'super@college.edu', password: 'superpass', role: 'superadmin' }
    ];

    // Hash in parallel
    const students = await Promise.all(studentsRaw.map(async s => ({ ...s, password: await hashPassword(s.password) })));
    const teachers = await Promise.all(teachersRaw.map(async t => ({ ...t, password: await hashPassword(t.password) })));
    const admins = await Promise.all(adminsRaw.map(async a => ({ ...a, password: await hashPassword(a.password) })));

    const insertedStudents = await Student.insertMany(students);
    const insertedTeachers = await Teacher.insertMany(teachers);
    const insertedAdmins = await Admin.insertMany(admins);

    console.log('Seeded:', { students: insertedStudents.length, teachers: insertedTeachers.length, admins: insertedAdmins.length });
  } catch (err) {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Mongo disconnected after seeding');
  }
}

run();
