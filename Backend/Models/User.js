const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  academicProfile: {
    currentCgpa: { type: String, default: "" },
    completedCredits: { type: String, default: "" },
    totalDegreeCredits: { type: String, default: "" },
    // New fields to save the active calculator state
    selectedCollege: { type: String, default: "manual" },
    selectedBranch: { type: String, default: "" },
    formula: { type: String, default: "weighted" },
    semesterData: [{
      id: { type: Number },
      gpa: { type: String },
      credits: { type: String }
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);