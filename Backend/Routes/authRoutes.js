const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const auth = require('../Middleware/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/me', auth, authController.currentUser);

module.exports = router;