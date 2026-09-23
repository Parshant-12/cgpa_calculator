<div align="center">
  
  # 🎓 CGPA Calc
  **The ultimate academic tool for GenZ students to calculate, plan, and conquer their CGPA.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 🌟 Overview

**CGPA Calc** is a sleek, dark-themed web application designed to help college students easily track and plan their academic progress. Built with a modern GenZ aesthetic (glassmorphism, glowing gradients, and smooth animations), it replaces confusing spreadsheets with an intuitive, user-friendly dashboard. 

Whether you need to quickly find your semester GPA, plan exactly what grades you need to hit your dream CGPA, or convert your score for a resume, CGPA Calc has you covered.

## ✨ Features

- **🧮 Smart Calculator:** Instantly calculate your SGPA/CGPA with support for both credit-weighted and simple average university formulas.
- **🎯 Target Planner:** Enter your dream CGPA, and the app will predict the exact average SGPA you need to maintain across your remaining semesters.
- **📊 Percentage Converter:** Quickly convert standard 10-point scale CGPAs into recognized percentage formats.
- **🔐 Secure Authentication:** JWT-based user authentication that auto-saves your academic profile (credits, current CGPA) so you never have to re-type them.
- **🎛️ Dynamic Admin Panel:** A secure, role-protected dashboard where admins can dynamically add new colleges, streams, and semester credit structures to the live database.
- **📥 Community Contributions:** Users can report missing colleges and submit credit structures with proof for verification.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Styling & Glassmorphism UI)
- Lucide React (Icons)
- React Router DOM (Navigation)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js (REST API)
- MongoDB & Mongoose (Database & ORM)
- JSON Web Tokens (JWT Authentication)
- Bcrypt.js (Password Hashing)

---

## 🚀 Installation & Setup

Follow these steps to get a local copy up and running.

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cgpa-calc.git
cd cgpa-calc
```

### 2. Backend Setup
Open a new terminal window and navigate to the backend folder:
```bash
cd Backend

# Install dependencies
npm install
```

Create a `.env` file in the root of the `Backend` directory and add your variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cgpa_calculator
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGINS=http://localhost:3000
```

For deployment, set these variables in the backend host instead of committing the `.env` file:

- `PORT`: supplied by the hosting provider when required
- `MONGO_URI`: production MongoDB Atlas connection string
- `JWT_SECRET`: long random production secret
- `CORS_ORIGINS`: frontend URL, or multiple comma-separated frontend URLs

Start the backend server:
```bash
# Runs on http://localhost:5000
npm run dev
# OR
node server.js
```

### 3. Frontend Setup
Open another terminal window and navigate to the frontend folder (root of the React app):
```bash
# From the root of your project
npm install

# Start the Vite development server
npm run dev
```
The frontend should now be running on `http://localhost:3000` (or `5173` depending on your Vite config).

### 4. Frontend Environment Variables

Create `Frontend/.env` for local development from `Frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_FRONTEND_PORT=3000
VITE_BACKEND_URL=http://localhost:5000
```

For Vercel, add these environment variables in the project settings:

- `VITE_API_URL`: public deployed backend URL, for example `https://your-backend.example.com`
- `VITE_FRONTEND_PORT`: only needed for local development
- `VITE_BACKEND_URL`: only needed for the local Vite development proxy

Only variables beginning with `VITE_` are exposed to browser code. Never place MongoDB credentials or `JWT_SECRET` in the frontend project.

---

## 👑 Admin Configuration

By default, all new users who sign up are assigned the standard `user` role. To access the secure Admin Panel (`/admin`) and manage the college database, you need to manually elevate your account privileges.

**How to set yourself as an Admin:**
1. Open **MongoDB Compass** (or MongoDB Atlas).
2. Connect to your database (`cgpa_calculator`).
3. Open the `users` collection.
4. Find your user document and click the **Edit (pencil)** icon.
5. Add a new field named `role` (type: String) or edit it if it exists.
6. Set the value to `"admin"`.
7. Click **Update**.
8. Log out and log back into the app. You will now see the Admin Panel link in your profile dropdown!

---

## 👨‍💻 Developed By

Built with 💜 for college students by:
* **Parshant Kumar**
* **Manav Sehgal**

---
<div align="center">
  <p>If you find this project helpful, please consider giving it a ⭐ on GitHub!</p>
</div>