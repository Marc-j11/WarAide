const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerRules, loginRules } = require('../validators/auth.validator');

const router = Router();

router.post('/register', validate(registerRules), asyncHandler(authController.register));
router.post('/login', validate(loginRules), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.me));

module.exports = router;
