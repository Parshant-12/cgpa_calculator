const User = require('../Models/User');

exports.updateAcademicProfile = async (req, res) => {
  try {
    const { 
      currentCgpa, 
      completedCredits, 
      totalDegreeCredits,
      selectedCollege,
      selectedBranch,
      formula,
      semesterData
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'academicProfile.currentCgpa': currentCgpa,
          'academicProfile.completedCredits': completedCredits,
          'academicProfile.totalDegreeCredits': totalDegreeCredits,
          // Save the calculator UI state
          'academicProfile.selectedCollege': selectedCollege,
          'academicProfile.selectedBranch': selectedBranch,
          'academicProfile.formula': formula,
          'academicProfile.semesterData': semesterData
        }
      },
      { new: true } // Returns the updated document
    );

    res.status(200).json({ message: "Profile updated successfully", academicProfile: updatedUser.academicProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};