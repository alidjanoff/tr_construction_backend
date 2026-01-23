const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { uploadProfile } = require('../config/upload');
const {
    login,
    logout,
    getMe,
    updateMe,
    register,
    getUsers,
    changeUserRole,
    deleteUser,
    sendOtpForPasswordChange,
    verifyOtp,
    changePassword
} = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/send_otp_to_email_for_change_password', sendOtpForPasswordChange);
router.post('/verify_otp', verifyOtp);
router.post('/change_password', changePassword);

// Protected routes
router.get('/logout', auth, logout);
router.get('/me', auth, getMe);
router.put('/me', auth, uploadProfile, updateMe);

// SuperAdmin only routes
router.post('/register', auth, roleCheck('superAdmin'), register);
router.get('/users', auth, roleCheck('superAdmin'), getUsers);
router.put('/change_user_role', auth, roleCheck('superAdmin'), changeUserRole);
router.delete('/users/:id', auth, roleCheck('superAdmin'), deleteUser);

module.exports = router;
