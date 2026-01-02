const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    details: {
        type: Map,
        of: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workflow', workflowSchema);
