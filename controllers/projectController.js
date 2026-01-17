const Project = require('../models/Project');
const { getImageUrl } = require('../config/upload');

// Helper to format project for list response
const formatProjectList = (project) => ({
    id: project._id,
    title: Object.fromEntries(project.title),
    slug: project.slug,
    badge: Object.fromEntries(project.badge),
    address: Object.fromEntries(project.address),
    map_url: project.map_url,
    cover_image: project.cover_image
});

// Helper to format project for detail response
const formatProjectDetail = (project) => ({
    id: project._id,
    title: Object.fromEntries(project.title),
    slug: project.slug,
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

// @desc    Get all projects with pagination
// @route   GET /api/v1/projects?page=1&limit=10
exports.getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Project.countDocuments();
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: projects.map(formatProjectList),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project by ID or Slug
// @route   GET /api/v1/projects/:idOrSlug
exports.getProject = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        // Try to find by ID first, then by slug
        let project = null;

        // Check if it looks like a MongoDB ObjectId
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            project = await Project.findById(idOrSlug);
        }

        // If not found by ID, try slug
        if (!project) {
            project = await Project.findOne({ slug: idOrSlug });
        }

        if (!project) {
            return res.status(404).json({ message: 'Layihə tapılmadı' });
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

        const project = new Project({
            title: new Map(Object.entries(parsedTitle)),
            details: new Map(Object.entries(parsedDetails || {})),
            badge: new Map(Object.entries(parsedBadge || {})),
            address: new Map(Object.entries(parsedAddress || {})),
            map_url: map_url || '',
            cover_image,
            image_gallery: []
        });

        await project.save();

        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(201).json(projects.map(formatProjectList));
    } catch (error) {
        // Handle duplicate title error
        if (error.code === 'DUPLICATE_TITLE') {
            return res.status(400).json({ message: error.message });
        }
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
            return res.status(404).json({ message: 'Layihə tapılmadı' });
        }

        project.title = new Map(Object.entries(parsedTitle));
        project.details = new Map(Object.entries(parsedDetails || {}));
        project.badge = new Map(Object.entries(parsedBadge || {}));
        project.address = new Map(Object.entries(parsedAddress || {}));
        if (map_url !== undefined) project.map_url = map_url;
        if (cover_image) project.cover_image = cover_image;

        await project.save();

        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects.map(formatProjectList));
    } catch (error) {
        // Handle duplicate title error
        if (error.code === 'DUPLICATE_TITLE') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Layihə tapılmadı' });
        }

        await Project.findByIdAndDelete(req.params.id);

        const projects = await Project.find().sort({ createdAt: -1 });
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
            return res.status(404).json({ message: 'Layihə tapılmadı' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                image_url: getImageUrl(file.filename)
            }));
            project.image_gallery.push(...newImages);
            await project.save();
        }

        const projects = await Project.find().sort({ createdAt: -1 });
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
            return res.status(404).json({ message: 'Layihə tapılmadı' });
        }

        const imageIndex = project.image_gallery.findIndex(
            img => img._id.toString() === id
        );

        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Şəkil qalereyada tapılmadı' });
        }

        if (req.file) {
            project.image_gallery[imageIndex].image_url = getImageUrl(req.file.filename);
            await project.save();
        }

        const projects = await Project.find().sort({ createdAt: -1 });
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
            return res.status(404).json({ message: 'Layihə tapılmadı' });
        }

        project.image_gallery = project.image_gallery.filter(
            img => img._id.toString() !== req.params.image_id
        );
        await project.save();

        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects.map(formatProjectDetail));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
