const User = require('../Models/User');

exports.updateAcademicProfile = async (req, res) => {
  try {
    const { currentCgpa, completedCredits, totalDegreeCredits } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          'academicProfile.currentCgpa': currentCgpa,
          'academicProfile.completedCredits': completedCredits,
          'academicProfile.totalDegreeCredits': totalDegreeCredits
        } 
      },
      { new: true } // Returns the updated document
    );

    res.status(200).json({ message: "Profile updated successfully", academicProfile: updatedUser.academicProfile });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};