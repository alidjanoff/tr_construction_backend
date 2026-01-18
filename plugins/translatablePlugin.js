/**
 * Mongoose Translatable Plugin
 * 
 * This plugin provides utilities for handling translatable fields in Mongoose schemas.
 * It works with Map<String, String> type fields and provides:
 * - Helper method to get translation with fallback
 * - Static method to get all translatable field names
 * 
 * Usage:
 *   const translatablePlugin = require('../plugins/translatablePlugin');
 *   schema.plugin(translatablePlugin, { fields: ['title', 'description'] });
 */

const translatablePlugin = function(schema, options = {}) {
    const translatableFields = options.fields || [];
    const defaultLanguage = options.defaultLanguage || 'en';

    // Store translatable fields metadata
    schema.statics.getTranslatableFields = function() {
        return translatableFields;
    };

    // Get default language
    schema.statics.getDefaultLanguage = function() {
        return defaultLanguage;
    };

    /**
     * Instance method to get a translation for a specific field
     * @param {string} fieldName - The name of the translatable field
     * @param {string} lang - The requested language
     * @returns {string|null} The translation or null if not found
     */
    schema.methods.getTranslation = function(fieldName, lang) {
        const field = this[fieldName];
        if (!field || !(field instanceof Map)) {
            return null;
        }

        // Try requested language first
        if (field.has(lang)) {
            return field.get(lang);
        }

        // Fallback to default language
        if (field.has(defaultLanguage)) {
            return field.get(defaultLanguage);
        }

        // Return first available translation
        const firstKey = field.keys().next().value;
        return firstKey ? field.get(firstKey) : null;
    };

    /**
     * Instance method to set a translation for a specific field
     * @param {string} fieldName - The name of the translatable field
     * @param {string} lang - The language code
     * @param {string} value - The translation value
     */
    schema.methods.setTranslation = function(fieldName, lang, value) {
        if (!this[fieldName]) {
            this[fieldName] = new Map();
        }
        this[fieldName].set(lang, value);
    };

    /**
     * Convert translatable fields to plain object for JSON response
     * This is used by the languageFilter middleware
     * @param {string} lang - Optional language to flatten to
     * @returns {object} The document with translatable fields converted to objects or strings
     */
    schema.methods.toTranslatedJSON = function(lang = null) {
        const obj = this.toObject({ virtuals: true });
        
        // Convert _id to id
        if (obj._id) {
            obj.id = obj._id;
            delete obj._id;
        }
        delete obj.__v;

        // Process translatable fields
        translatableFields.forEach(fieldName => {
            if (obj[fieldName]) {
                if (obj[fieldName] instanceof Map) {
                    obj[fieldName] = Object.fromEntries(obj[fieldName]);
                }
                
                // If language specified, flatten the field
                if (lang && typeof obj[fieldName] === 'object') {
                    obj[fieldName] = obj[fieldName][lang] || obj[fieldName][defaultLanguage] || Object.values(obj[fieldName])[0] || '';
                }
            }
        });

        return obj;
    };
};

module.exports = translatablePlugin;
