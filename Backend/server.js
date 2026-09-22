const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const contributionRoutes = require('./Routes/contributionRoutes');
const collegeRoutes = require('./Routes/collegeRoutes');
const reportRoutes = require('./Routes/reportRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Matches your Vite frontend port
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/reports', reportRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));