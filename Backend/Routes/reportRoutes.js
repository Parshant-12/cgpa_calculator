const express = require('express');
const CollegeReport = require('../Models/CollegeReport');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const report = await CollegeReport.create(req.body);
    res.status(201).json({ message: 'College request submitted successfully.', reportId: report._id });
  } catch (error) {
    res.status(400).json({ error: 'Invalid college request data.' });
  }
});

module.exports = router;
