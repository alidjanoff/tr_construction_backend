const mongoose = require('mongoose');

// Slug generation helper
const generateSlug = (title) => {
    // Try Azerbaijan first, then English
    const text = title?.get?.('az') || title?.get?.('en') || '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/ə/g, 'e')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const projectSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    details: {
        type: Map,
        of: String,
        required: true
    },
    badge: {
        type: Map,
        of: String,
        default: new Map()
    },
    address: {
        type: Map,
        of: String,
        required: true
    },
    map_url: {
        type: String,
        default: ''
    },
    cover_image: {
        type: String,
        required: true
    },
    image_gallery: [{
        image_url: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Pre-save hook to generate slug from title
projectSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('title')) {
        let baseSlug = generateSlug(this.title);

        if (!baseSlug) {
            baseSlug = 'project';
        }

        // Check for existing slug
        const existingProject = await mongoose.model('Project').findOne({
            slug: baseSlug,
            _id: { $ne: this._id }
        });

        if (existingProject) {
            const error = new Error('Bu adda layihə artıq mövcuddur. Zəhmət olmasa başqa ad seçin.');
            error.code = 'DUPLICATE_TITLE';
            return next(error);
        }

        this.slug = baseSlug;
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);
