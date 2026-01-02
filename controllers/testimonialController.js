const Testimonial = require('../models/Testimonial');

// Helper to format testimonial response
const formatTestimonial = (testimonial) => ({
    id: testimonial._id,
    customer_full_name: testimonial.customer_full_name,
    customer_type: Object.fromEntries(testimonial.customer_type),
    customer_review: Object.fromEntries(testimonial.customer_review),
    rating: testimonial.rating
});

// @desc    Get all testimonials
// @route   GET /api/v1/testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.json(testimonials.map(formatTestimonial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a testimonial
// @route   POST /api/v1/testimonials
exports.createTestimonial = async (req, res) => {
    try {
        const { customer_full_name, customer_type, customer_review, rating } = req.body;

        await Testimonial.create({
            customer_full_name,
            customer_type: new Map(Object.entries(customer_type)),
            customer_review: new Map(Object.entries(customer_review)),
            rating
        });

        const testimonials = await Testimonial.find();
        res.status(201).json(testimonials.map(formatTestimonial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a testimonial
// @route   PUT /api/v1/testimonials
exports.updateTestimonial = async (req, res) => {
    try {
        const { id, customer_full_name, customer_type, customer_review, rating } = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        testimonial.customer_full_name = customer_full_name;
        testimonial.customer_type = new Map(Object.entries(customer_type));
        testimonial.customer_review = new Map(Object.entries(customer_review));
        testimonial.rating = rating;
        await testimonial.save();

        const testimonials = await Testimonial.find();
        res.json(testimonials.map(formatTestimonial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a testimonial
// @route   DELETE /api/v1/testimonials/:id
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        await Testimonial.findByIdAndDelete(req.params.id);

        const testimonials = await Testimonial.find();
        res.json(testimonials.map(formatTestimonial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
