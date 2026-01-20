/**
 * Language Filter Middleware
 * 
 * This middleware intercepts JSON responses and flattens translatable fields
 * based on the Accept-Language header. If no language header is provided,
 * the full translation objects are returned (for admin panel use).
 * 
 * Header: Accept-Language: az|en|tr|ru|...
 * 
 * Fallback Logic:
 * 1. Try requested language
 * 2. Fall back to default language ('en')
 * 3. Fall back to first available translation
 */

const DEFAULT_LANGUAGE = 'en';

// List of known language codes (2-3 lowercase letters)
const KNOWN_LANGUAGE_CODES = ['az', 'en', 'tr', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'ar', 'zh', 'ja', 'ko'];

/**
 * Check if a value is a MongoDB ObjectId
 * @param {any} value - The value to check
 * @returns {boolean} True if it's an ObjectId
 */
const isObjectId = (value) => {
    if (!value || typeof value !== 'object') return false;

    // Check for ObjectId-like structure
    if (value.buffer !== undefined && typeof value.buffer === 'object') {
        return true;
    }

    // Check for mongoose ObjectId
    if (value._bsontype === 'ObjectID' || value._bsontype === 'ObjectId') {
        return true;
    }

    // Check if it has toString that produces a 24-char hex string
    if (typeof value.toString === 'function') {
        const str = value.toString();
        if (/^[a-f0-9]{24}$/i.test(str)) {
            return true;
        }
    }

    return false;
};

/**
 * Check if an object looks like a translation map
 * Translation maps have language codes as keys with string values
 * @param {object} obj - The object to check
 * @returns {boolean} True if it looks like a translation map
 */
const isLikelyTranslationMap = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return false;
    }

    // If it has an _id field, it's not a translation map
    if (obj._id !== undefined || obj.id !== undefined) {
        return false;
    }

    // If it looks like an ObjectId, it's not a translation map
    if (isObjectId(obj)) {
        return false;
    }

    const keys = Object.keys(obj);

    // Empty object is not a translation map
    if (keys.length === 0) {
        return false;
    }

    // Check if ALL keys are known language codes (2-3 lowercase letters)
    const languageCodePattern = /^[a-z]{2,3}$/;
    const allKeysAreLangCodes = keys.every(key => languageCodePattern.test(key));

    // Check if all values are strings (translation values should be strings)
    const allValuesAreStrings = Object.values(obj).every(val => typeof val === 'string');

    // At least one key should be a known language code for extra safety
    const hasKnownLangCode = keys.some(key => KNOWN_LANGUAGE_CODES.includes(key));

    return allKeysAreLangCodes && allValuesAreStrings && hasKnownLangCode;
};

/**
 * Recursively filter data based on language
 * @param {any} data - The data to filter (can be object, array, or primitive)
 * @param {string} lang - The requested language code
 * @returns {any} The filtered data
 */
const filterByLanguage = (data, lang) => {
    if (data === null || data === undefined) return data;

    // Handle primitives
    if (typeof data !== 'object') {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => filterByLanguage(item, lang));
    }

    // Handle Date objects
    if (data instanceof Date) {
        return data;
    }

    // Handle ObjectId - convert to string
    if (isObjectId(data)) {
        return data.toString();
    }

    // Convert Mongoose document to plain object
    let obj;
    if (typeof data.toObject === 'function') {
        obj = data.toObject();
    } else if (typeof data.toJSON === 'function') {
        obj = data.toJSON();
    } else {
        obj = { ...data };
    }

    // Check if this is a translation map (has language keys like 'az', 'en')
    if (isLikelyTranslationMap(obj)) {
        // This is a translation object, extract the value for the requested language
        if (obj[lang] !== undefined) {
            return obj[lang];
        } else if (obj[DEFAULT_LANGUAGE] !== undefined) {
            return obj[DEFAULT_LANGUAGE];
        } else {
            // Return first available value
            const values = Object.values(obj);
            return values.length > 0 ? values[0] : '';
        }
    }

    // Process each property recursively
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Skip mongoose internal fields
            if (key === '__v') continue;

            const value = obj[key];

            // Handle ObjectId specifically
            if (isObjectId(value)) {
                result[key] = value.toString();
            } else {
                result[key] = filterByLanguage(value, lang);
            }
        }
    }
    return result;
};

/**
 * Express middleware that intercepts res.json() and filters response by language
 * 
 * NOTE: If Authorization header is present (admin dashboard), we skip language filtering
 * so the dashboard always receives all translations for editing purposes.
 */
const languageFilter = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
        const lang = req.header('Accept-Language');
        const hasAuth = req.header('Authorization');

        // Skip filtering for authenticated requests (admin dashboard)
        // They need all translations for editing
        if (hasAuth) {
            return originalJson(data);
        }

        // Only filter if Accept-Language header is present and data exists
        if (lang && data) {
            // Parse Accept-Language to get primary language (e.g., "az" from "az,en;q=0.9")
            const primaryLang = lang.split(',')[0].split('-')[0].toLowerCase();
            const filteredData = filterByLanguage(data, primaryLang);
            return originalJson(filteredData);
        }

        return originalJson(data);
    };

    // Store language in request for controller use
    req.lang = req.header('Accept-Language')?.toLowerCase() || null;

    next();
};

// Export utilities for testing
module.exports = languageFilter;
module.exports.filterByLanguage = filterByLanguage;
module.exports.isLikelyTranslationMap = isLikelyTranslationMap;
module.exports.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
