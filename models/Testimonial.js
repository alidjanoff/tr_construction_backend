const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    customer_full_name: {
        type: String,
        required: true
    },
    customer_type: {
        type: Map,
        of: String,
        required: true
    },
    customer_review: {
        type: Map,
        of: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
