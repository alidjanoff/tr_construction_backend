const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { getImageUrl } = require('../config/upload');

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                access_token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
exports.logout = async (req, res) => {
    try {
        res.json('Uğurla çıxış etdiniz');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            id: user._id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update current user profile
// @route   PUT /api/v1/auth/me
exports.updateMe = async (req, res) => {
    try {
        const { full_name, phone, email } = req.body;
        const updateData = { full_name, phone, email };

        if (req.file) {
            updateData.profile_image = getImageUrl(req.file.filename);
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password');

        res.json({
            id: user._id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new user (superAdmin only)
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
    try {
        const { full_name, email, password, phone, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            full_name,
            email,
            password,
            phone,
            role: role || 'admin'
        });

        res.status(201).json({
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile_image: user.profile_image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (superAdmin only)
// @route   GET /api/v1/auth/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users.map(user => ({
            id: user._id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change user role (superAdmin only)
// @route   PUT /api/v1/auth/change_user_role
exports.changeUserRole = async (req, res) => {
    try {
        const { id, role } = req.body;

        if (!['admin', 'superAdmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (superAdmin only)
// @route   DELETE /api/v1/auth/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        const users = await User.find().select('-password');
        res.json(users.map(u => ({
            id: u._id,
            full_name: u.full_name,
            phone: u.phone,
            email: u.email,
            role: u.role,
            profile_image: u.profile_image
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP to email for password change
// @route   POST /api/v1/auth/send_otp_to_email_for_change_password
exports.sendOtpForPasswordChange = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await User.findByIdAndUpdate(user._id, { otp, otpExpires });

        // In a real app, you would send this OTP via email
        // For now, we'll just return a success message
        console.log(`OTP for ${email}: ${otp}`);

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password with OTP
// @route   POST /api/v1/auth/change_password
exports.changePassword = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        user.password = new_password;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
