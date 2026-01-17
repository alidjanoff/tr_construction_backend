const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        default: new Map()
    },
    info: {
        type: Map,
        of: String,
        default: new Map()
    },
    image_url: {
        type: String,
        default: ''
    },
    button_text: {
        type: Map,
        of: String,
        default: new Map()
    },
    button_url: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
