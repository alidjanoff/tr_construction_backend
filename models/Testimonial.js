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
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
