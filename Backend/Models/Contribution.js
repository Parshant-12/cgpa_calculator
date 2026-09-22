const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
	{
		collegeName: { type: String, required: true, trim: true },
		branchName: { type: String, required: true, trim: true },
		creditStructure: { type: String, required: true, trim: true },
		proofLink: { type: String, required: true, trim: true },
		submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Contribution', contributionSchema);
