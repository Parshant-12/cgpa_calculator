const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchId: { type: String, required: true }, // e.g., 'cse'
  name: { type: String, required: true }, // e.g., 'B.Tech - Computer Science'
  formula: { type: String, enum: ['weighted', 'average'], default: 'weighted' },
  credits: [{ type: Number, required: true }] // Array of credits [20, 20, 24, 24...]
});

const collegeSchema = new mongoose.Schema({
  collegeId: { type: String, required: true, unique: true }, // e.g., 'cec_landran'
  name: { type: String, required: true },
  branches: [branchSchema]
});

module.exports = mongoose.model('College', collegeSchema);