const express = require('express');
const router = express.Router();
const College = require('../Models/College');
const adminAuth = require('../Middleware/adminAuth');

// GET /api/colleges - Public list used by the calculator
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Server error while loading college data." });
  }
});

// POST /api/colleges - Protected by adminAuth
router.post('/', adminAuth, async (req, res) => {
  try {
    const { collegeId, name, branch } = req.body;

    // Check if college exists, if so, push the new branch to it
    let college = await College.findOne({ collegeId });
    
    if (college) {
      // Prevent duplicate branches
      const branchExists = college.branches.find(b => b.branchId === branch.branchId);
      if (branchExists) return res.status(400).json({ error: "Branch already exists for this college." });
      
      college.branches.push(branch);
      await college.save();
      return res.status(200).json({ message: "Branch added to existing college successfully!" });
    }

    // Create entirely new college if it doesn't exist
    const newCollege = new College({
      collegeId,
      name,
      branches: [branch]
    });
    
    await newCollege.save();
    res.status(201).json({ message: "New college and branch created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error while saving college data." });
  }
});

module.exports = router;