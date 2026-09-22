const mongoose = require('mongoose');

const collegeReportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CollegeReport', collegeReportSchema);
