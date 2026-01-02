const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, .jpeg, .webp, .avif files are allowed'), false);
    }
};

// Single file upload
const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('image');

// Multiple files upload
const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).array('images', 10);

// Profile image upload
const uploadProfile = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('profile_image');

// Cover image upload for projects
const uploadCover = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('cover_image');

// Get image URL from filename
const getImageUrl = (filename) => {
    return `${process.env.BASE_URL}/uploads/${filename}`;
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadProfile,
    uploadCover,
    getImageUrl
};
