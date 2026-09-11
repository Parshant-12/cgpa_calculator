# CGPA Calc — Frontend

React/Vite frontend only. No backend is included.

## Pages

- `/` — CGPA Calculator
- `/signin` — Sign In
- `/signup` — Sign Up
- `/forgot-password` — Forgot Password
- `/reset-link-sent` — Reset Link Sent
- `/reset-password?token=...` — Reset Password
- `/reset-success` — Password Reset Success

## Run

```bash
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Backend comments

Backend integration comments are included throughout `src/App.jsx` and `src/api.js`.

Suggested endpoints:

```text
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/calculations
GET  /api/calculations
```

Password reset:

```text
Forgot Password
      ↓
Send Reset Link
      ↓
/reset-password?token=SECURE_TOKEN
      ↓
Reset Password
      ↓
Success
      ↓
Sign In
```

The backend should generate a short-lived, single-use reset token and store only its secure hash.
