const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    count: {
        type: Map,
        of: String,
        required: true
    },
    detail: {
        type: Map,
        of: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stat', statSchema);
