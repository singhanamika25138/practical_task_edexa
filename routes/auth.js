const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register',authController.register);
router.get('/getAllUsers',authController.getAllUsers);
router.put('/editUser/:id',authController.editUser);
router.put('/deleteUser/:id',authController.deleteUser);

module.exports = router;