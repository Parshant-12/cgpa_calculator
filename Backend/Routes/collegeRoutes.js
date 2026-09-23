const express = require('express');
const router = express.Router();
const College = require('../Models/College');
const adminAuth = require('../Middleware/adminAuth');

// ==========================================
// @route   GET /api/colleges
// @desc    Fetch all colleges and their branches
// @access  Public (Used by Dashboard for calculations)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (error) {
    console.error("Fetch Colleges Error:", error);
    res.status(500).json({ error: "Failed to fetch colleges from the database." });
  }
});

// ==========================================
// @route   POST /api/colleges
// @desc    Add a new college OR add a branch to an existing college
// @access  Private (Admin Only)
// ==========================================
router.post('/', adminAuth, async (req, res) => {
  try {
    const { collegeId, name, branch } = req.body;

    // Check if the college already exists in the DB
    let college = await College.findOne({ collegeId });
    
    if (college) {
      // Prevent adding a duplicate branch to the same college
      const branchExists = college.branches.find(b => b.branchId === branch.branchId);
      if (branchExists) {
        return res.status(400).json({ error: "This branch already exists for this college." });
      }
      
      // Push the new branch to the existing college
      college.branches.push(branch);
      await college.save();
      return res.status(200).json({ message: "Branch added to existing college successfully!" });
    }

    // If college doesn't exist, create an entirely new college document
    const newCollege = new College({
      collegeId,
      name,
      branches: [branch]
    });
    
    await newCollege.save();
    res.status(201).json({ message: "New college and branch created successfully!" });
  } catch (error) {
    console.error("Create College Error:", error);
    res.status(500).json({ error: "Server error while saving college data." });
  }
});

// ==========================================
// @route   PUT /api/colleges/:collegeDbId/branches/:branchId
// @desc    Update a specific branch inside a specific college
// @access  Private (Admin Only)
// ==========================================
router.put('/:collegeDbId/branches/:branchId', adminAuth, async (req, res) => {
  try {
    const { name, branch } = req.body; // 'name' here is the College Name
    
    // Finds the college by its MongoDB _id and specifically targets the branch matching branchId
    const updatedCollege = await College.updateOne(
      { _id: req.params.collegeDbId, "branches.branchId": req.params.branchId },
      { 
        $set: { 
          name: name, // Updates college name in case it was modified
          "branches.$": branch // The '$' operator replaces the matched branch object entirely
        } 
      }
    );

    if (updatedCollege.modifiedCount === 0) {
      return res.status(404).json({ error: "Branch or College not found, or no changes made." });
    }

    res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Update Branch Error:", error);
    res.status(500).json({ error: "Failed to update the branch data." });
  }
});

// ==========================================
// @route   DELETE /api/colleges/:collegeDbId/branches/:branchId
// @desc    Delete a specific branch from a college
// @access  Private (Admin Only)
// ==========================================
router.delete('/:collegeDbId/branches/:branchId', adminAuth, async (req, res) => {
  try {
    const collegeId = req.params.collegeDbId;
    const branchId = req.params.branchId;

    // 1. Remove the branch from the college and return the updated document ({ new: true })
    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      { $pull: { branches: { branchId: branchId } } },
      { new: true } 
    );

    if (!updatedCollege) {
      return res.status(404).json({ error: "College not found." });
    }

    // 2. Check if the college has any branches left
    if (updatedCollege.branches.length === 0) {
      // If empty, delete the entire college document
      await College.findByIdAndDelete(collegeId);
      return res.status(200).json({ 
        message: "Branch deleted. College had no other branches and was completely removed." 
      });
    }

    res.status(200).json({ message: "Branch deleted successfully." });
  } catch (error) {
    console.error("Delete Branch Error:", error);
    res.status(500).json({ error: "Failed to delete the branch." });
  }
});

module.exports = router;