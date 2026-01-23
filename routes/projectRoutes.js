const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadCover } = require('../config/upload');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addProjectImages,
    updateProjectImage,
    deleteProjectImage
} = require('../controllers/projectController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for multiple images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Double-check directory exists before saving
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const uploadImages = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg, .webp, .avif files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
}).array('image', 10);

const uploadSingleImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg, .webp, .avif files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('image');

// Public routes
router.get('/', languageFilter, getProjects);
router.get('/:idOrSlug', languageFilter, getProject);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, uploadCover, languageFilter, createProject);
router.put('/', auth, uploadCover, languageFilter, updateProject);
router.delete('/:id', auth, languageFilter, deleteProject);

// Project image gallery routes
router.post('/images/:project_id', auth, uploadImages, languageFilter, addProjectImages);
router.put('/images/:project_id', auth, uploadSingleImage, languageFilter, updateProjectImage);
router.delete('/:project_id/:image_id', auth, languageFilter, deleteProjectImage);

module.exports = router;
