const ContactInfo = require('../models/ContactInfo');

// Helper to format contact info response
const formatContactInfo = (contactInfo) => ({
    id: contactInfo._id,
    title: Object.fromEntries(contactInfo.title),
    detail: Object.fromEntries(contactInfo.detail),
    url: contactInfo.url || undefined,
    contact_type: contactInfo.contact_type
});

// @desc    Get all contact info
// @route   GET /api/v1/contact_info
exports.getContactInfos = async (req, res) => {
    try {
        const contactInfos = await ContactInfo.find();
        res.json(contactInfos.map(formatContactInfo));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create contact info
// @route   POST /api/v1/contact_info
exports.createContactInfo = async (req, res) => {
    try {
        const { title, detail, url, contact_type } = req.body;

        await ContactInfo.create({
            title: new Map(Object.entries(title)),
            detail: new Map(Object.entries(detail)),
            url: url || '',
            contact_type
        });

        const contactInfos = await ContactInfo.find();
        res.status(201).json(contactInfos.map(formatContactInfo));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update contact info
// @route   PUT /api/v1/contact_info
exports.updateContactInfo = async (req, res) => {
    try {
        const { id, title, detail, url, contact_type } = req.body;

        const contactInfo = await ContactInfo.findById(id);
        if (!contactInfo) {
            return res.status(404).json({ message: 'Contact info not found' });
        }

        contactInfo.title = new Map(Object.entries(title));
        contactInfo.detail = new Map(Object.entries(detail));
        contactInfo.url = url || '';
        contactInfo.contact_type = contact_type;
        await contactInfo.save();

        const contactInfos = await ContactInfo.find();
        res.json(contactInfos.map(formatContactInfo));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contact info
// @route   DELETE /api/v1/contact_info/:id
exports.deleteContactInfo = async (req, res) => {
    try {
        const contactInfo = await ContactInfo.findById(req.params.id);
        if (!contactInfo) {
            return res.status(404).json({ message: 'Contact info not found' });
        }

        await ContactInfo.findByIdAndDelete(req.params.id);

        const contactInfos = await ContactInfo.find();
        res.json(contactInfos.map(formatContactInfo));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
