'use strict';
var config = require('./config');
module.exports = {
    truncate: function (string) {
        var MAX_LENGTH = 100;

        if (string.length > MAX_LENGTH) {
            return string.substring(0, MAX_LENGTH) + ' [...]';
        }

        return string;
    },

    commentUrl: function (string, commentId) {
        return string + "/overview?commentId=" + commentId;
    },

    getPossiblyUndefinedKeyValue: function (obj, keySequence) {
        var keys = keySequence.split('.');

        while (obj && keys.length) {
            obj = obj[keys.shift()];
        }

        return obj || undefined;
    },

    COLORS: {
        red: config.danger || '#e74c3c',
        green: config.success || '#2ecc71',
        blue: config.info || '#3498db',
        yellow: config.warning ||'#f1c40f'
    },

    FEATURE_SWITCH: {
        mentionReviewers: config.mentionReviewers || true
    }
};
