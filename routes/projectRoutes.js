const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

// Configure multer for multiple images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
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

// Protected routes
router.post('/', auth, uploadCover, createProject);
router.put('/', auth, uploadCover, updateProject);
router.delete('/:id', auth, deleteProject);

// Project image gallery routes
router.post('/images/:project_id', auth, uploadImages, addProjectImages);
router.put('/images/:project_id', auth, uploadSingleImage, updateProjectImage);
router.delete('/:project_id/:image_id', auth, deleteProjectImage);

module.exports = router;
