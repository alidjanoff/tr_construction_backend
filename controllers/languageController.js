const Language = require('../models/Language');

// @desc    Get all languages
// @route   GET /api/v1/languages
exports.getLanguages = async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages.map(lang => ({
            id: lang._id,
            lang: lang.lang
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a language
// @route   POST /api/v1/languages
exports.createLanguage = async (req, res) => {
    try {
        const { lang } = req.body;

        const existingLang = await Language.findOne({ lang });
        if (existingLang) {
            return res.status(400).json({ message: 'Language already exists' });
        }

        await Language.create({ lang });

        const languages = await Language.find();
        res.status(201).json(languages.map(l => ({
            id: l._id,
            lang: l.lang
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a language
// @route   PUT /api/v1/languages
exports.updateLanguage = async (req, res) => {
    try {
        const { id, lang } = req.body;

        const language = await Language.findByIdAndUpdate(
            id,
            { lang },
            { new: true }
        );

        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        const languages = await Language.find();
        res.json(languages.map(l => ({
            id: l._id,
            lang: l.lang
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a language
// @route   DELETE /api/v1/languages/:id
exports.deleteLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);

        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        await Language.findByIdAndDelete(req.params.id);

        const languages = await Language.find();
        res.json(languages.map(l => ({
            id: l._id,
            lang: l.lang
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
