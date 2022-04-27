const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/authController');

router.post('/login', usersController.login);

module.exports = router;