const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);
