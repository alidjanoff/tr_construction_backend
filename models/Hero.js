const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    info: {
        type: Map,
        of: String,
        required: true
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
