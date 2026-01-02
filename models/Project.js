const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    details: {
        type: Map,
        of: String,
        default: new Map()
    },
    badge: {
        type: Map,
        of: String,
        default: new Map()
    },
    address: {
        type: Map,
        of: String,
        default: new Map()
    },
    map_url: {
        type: String,
        default: ''
    },
    cover_image: {
        type: String,
        default: ''
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

module.exports = mongoose.model('Project', projectSchema);
