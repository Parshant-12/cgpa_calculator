const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const auth = require('../Middleware/auth'); // Protects the route

// Requires JWT token in headers
router.put('/profile', auth, userController.updateAcademicProfile);

module.exports = router;