'use strict';

module.exports = {
    truncate: function (string) {
        var MAX_LENGTH = 100;

        if (string.length > MAX_LENGTH) {
            return string.substring(0, MAX_LENGTH) + ' [...]';
        }

        return string;
    },

    getPossiblyUndefinedKeyValue: function (obj, keySequence) {
        var keys = keySequence.split('.');

        while (obj && keys.length) {
            obj = obj[keys.shift()];
        }

        return obj || undefined;
    },

    COLORS: {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00'
    }
};

