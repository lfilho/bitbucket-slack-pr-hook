'use strict';

var Slack = require('node-slack');
var config = require('./config');

function noop() {}

module.exports = (function () {
    var slack = new Slack(config.webhook);
    var params = {
        attachments: []
    };

    if (typeof config.username !== 'undefined') {
        params.username = config.username;
    }

    if (config.channel !== '#undefined' && typeof channel !== 'undefined') {
        params.channel = config.channel;
    }

    var sendMessage = function (message, channel) {
        // `text` is mandatory:
        params.text = message.fallback;
        params.attachments[0] = message;

        if (channel !== '') {
            params.channel = '#' + channel;
        }

        slack.send(params, noop);
    };

    return {
        sendMessage: sendMessage
    };
})();
