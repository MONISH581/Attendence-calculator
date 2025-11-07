# MyshakthiVue — Digital Attendance (Frontend + Backend)

Date: 2025-08-16

## What you have
- Frontend (no build tools): `frontend/student.html`, `frontend/teacher.html`, `frontend/admin.html`, `frontend/superadmin.html`
- Backend: Node.js + Express + MongoDB (Mongoose) in `backend/`
- Public static folder: `public/`

## Quick Start
1) Install Node.js and MongoDB.
2) Extract this ZIP. In the project folder run:
   ```bash
   npm install
   npm run seed     # adds 5 students, 2 teachers, 1 superadmin
   npm start        # starts server on http://localhost:5000
   ```
3) Open these in your browser (double-click or serve with VS Code Live Server):
   - `frontend/student.html` (your uploaded calculator)
   - `frontend/teacher.html` (mark Present/Absent for each student)
   - `frontend/admin.html` (add/delete students and teachers)
   - `frontend/superadmin.html` (manage admins)

> If your backend is on a different port/host, open DevTools console and set:
```js
localStorage.API_BASE = "http://YOUR_HOST:YOUR_PORT"
```

## API Endpoints (summary)
- Students: `GET/POST /api/students`, `GET/PUT/DELETE /api/students/:id`
- Teachers: `GET/POST /api/teachers`, `DELETE /api/teachers/:id`
- Admins: `GET/POST /api/admins`, `DELETE /api/admins/:id`
- Attendance: `POST /api/attendance/mark` → body: `{ studentId, status, date:"YYYY-MM-DD", subject? }`
- Reports: `GET /api/attendance/summary`

## Notes
- This is intentionally simple: **no auth**, minimal validation. Good for college demo/POC.
- You can later add login (JWT) and role-based guards.
- Teacher panel prevents duplicate entries for the same date by updating the record for that date.
- Student-side calculator is the file you originally uploaded (`frontend/student.html`).

Good luck and build boldly! 🚀
