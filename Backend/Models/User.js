const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // <-- New Role Field
  academicProfile: {
    currentCgpa: { type: String, default: "" },
    completedCredits: { type: String, default: "" },
    totalDegreeCredits: { type: String, default: "" }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);