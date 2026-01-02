const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    detail: {
        type: Map,
        of: String,
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    contact_type: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
