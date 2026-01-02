const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Social', socialSchema);
