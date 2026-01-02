// Middleware to filter response based on Accept-Language header
const filterByLanguage = (data, lang) => {
    if (!data || !lang) return data;

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => filterByLanguage(item, lang));
    }

    // Handle Mongoose documents
    const obj = data.toObject ? data.toObject() : { ...data };

    // Iterate through object keys and filter Map fields
    for (const key in obj) {
        if (obj[key] instanceof Map || (obj[key] && typeof obj[key] === 'object' && obj[key].constructor === Object)) {
            // Check if this looks like a translation object (has language keys)
            const value = obj[key] instanceof Map ? Object.fromEntries(obj[key]) : obj[key];
            if (value[lang] !== undefined) {
                obj[key] = value[lang];
            } else if (value['en'] !== undefined) {
                // Fallback to English
                obj[key] = value['en'];
            }
        } else if (Array.isArray(obj[key])) {
            obj[key] = filterByLanguage(obj[key], lang);
        } else if (obj[key] && typeof obj[key] === 'object') {
            obj[key] = filterByLanguage(obj[key], lang);
        }
    }

    return obj;
};

const languageFilter = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
        const lang = req.header('Accept-Language');

        // Only filter if Accept-Language header is present
        if (lang && data) {
            const filteredData = filterByLanguage(data, lang);
            return originalJson(filteredData);
        }

        return originalJson(data);
    };

    next();
};

module.exports = languageFilter;
