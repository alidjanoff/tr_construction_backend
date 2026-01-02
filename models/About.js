const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
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
    description: {
        type: Map,
        of: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    our_mission: {
        type: Map,
        of: String,
        required: true
    },
    our_vision: {
        type: Map,
        of: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
