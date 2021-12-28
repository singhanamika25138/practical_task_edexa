const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middleware = require('../middlewares/basicAuthMiddleware');

router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/users',middleware,authController.users)
module.exports = router;