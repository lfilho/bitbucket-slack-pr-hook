'use strict';

var Slack = require('node-slack');
var config = require('./config');

function noop() {}

module.exports = (function () {
    var slack = new Slack(config.token),

     params = {
        channel: config.channel,
        username: config.username,
        attachments: []
    },

     sendMessage = function (message, channel) {
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
