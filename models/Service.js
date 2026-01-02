const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    info: {
        type: Map,
        of: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
