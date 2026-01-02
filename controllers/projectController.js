const Project = require('../models/Project');
const { getImageUrl } = require('../config/upload');

// Helper to format project for list response
const formatProjectList = (project) => ({
    id: project._id,
    title: Object.fromEntries(project.title),
    badge: Object.fromEntries(project.badge),
    address: Object.fromEntries(project.address),
    map_url: project.map_url,
    cover_image: project.cover_image
});

// Helper to format project for detail response
const formatProjectDetail = (project) => ({
    id: project._id,
    title: Object.fromEntries(project.title),
    details: Object.fromEntries(project.details),
    badge: Object.fromEntries(project.badge),
    address: Object.fromEntries(project.address),
    map_url: project.map_url,
    cover_image: project.cover_image,
    image_gallery: project.image_gallery.map(img => ({
        id: img._id,
        image_url: img.image_url
    }))
});

// @desc    Get all projects
// @route   GET /api/v1/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects.map(formatProjectList));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(formatProjectDetail(project));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/v1/projects
exports.createProject = async (req, res) => {
    try {
        const { title, details, badge, address, map_url } = req.body;

        const cover_image = req.file ? getImageUrl(req.file.filename) : '';

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
        const parsedBadge = typeof badge === 'string' ? JSON.parse(badge) : badge;
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        await Project.create({
            title: new Map(Object.entries(parsedTitle)),
            details: new Map(Object.entries(parsedDetails || {})),
            badge: new Map(Object.entries(parsedBadge || {})),
            address: new Map(Object.entries(parsedAddress || {})),
            map_url: map_url || '',
            cover_image,
            image_gallery: []
        });

        const projects = await Project.find();
        res.status(201).json(projects.map(formatProjectList));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/v1/projects
exports.updateProject = async (req, res) => {
    try {
        const { id, title, details, badge, address, map_url } = req.body;

        const cover_image = req.file ? getImageUrl(req.file.filename) : null;

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
        const parsedBadge = typeof badge === 'string' ? JSON.parse(badge) : badge;
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.title = new Map(Object.entries(parsedTitle));
        project.details = new Map(Object.entries(parsedDetails || {}));
        project.badge = new Map(Object.entries(parsedBadge || {}));
        project.address = new Map(Object.entries(parsedAddress || {}));
        if (map_url !== undefined) project.map_url = map_url;
        if (cover_image) project.cover_image = cover_image;
        await project.save();

        const projects = await Project.find();
        res.json(projects.map(formatProjectList));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);

        const projects = await Project.find();
        res.json(projects.map(formatProjectList));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add images to project gallery
// @route   POST /api/v1/projects/images/:project_id
exports.addProjectImages = async (req, res) => {
    try {
        const project = await Project.findById(req.params.project_id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                image_url: getImageUrl(file.filename)
            }));
            project.image_gallery.push(...newImages);
            await project.save();
        }

        const projects = await Project.find();
        res.json(projects.map(formatProjectDetail));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project gallery image
// @route   PUT /api/v1/projects/images/:project_id
exports.updateProjectImage = async (req, res) => {
    try {
        const { id } = req.body;
        const project = await Project.findById(req.params.project_id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const imageIndex = project.image_gallery.findIndex(
            img => img._id.toString() === id
        );

        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Image not found in gallery' });
        }

        if (req.file) {
            project.image_gallery[imageIndex].image_url = getImageUrl(req.file.filename);
            await project.save();
        }

        const projects = await Project.find();
        res.json(projects.map(formatProjectDetail));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project gallery image
// @route   DELETE /api/v1/projects/:project_id/:image_id
exports.deleteProjectImage = async (req, res) => {
    try {
        const project = await Project.findById(req.params.project_id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.image_gallery = project.image_gallery.filter(
            img => img._id.toString() !== req.params.image_id
        );
        await project.save();

        const projects = await Project.find();
        res.json(projects.map(formatProjectDetail));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
