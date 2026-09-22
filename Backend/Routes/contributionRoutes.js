const express = require('express');
const router = express.Router();
const Contribution = require('../Models/Contribution');

router.post('/', async (req, res) => {
  try {
    const newContribution = new Contribution(req.body);
    await newContribution.save();
    res.status(201).json({ message: "Contribution submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit contribution." });
  }
});

module.exports = router;