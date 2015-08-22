'use strict';

require('dotenv').load();

module.exports = {
    port: Number(process.env.PORT) || 5000,
    webhook: process.env.SLACK_WEBHOOK, // Slack Incoming Webhook
    channel: '#' + process.env.SLACK_CHANNEL, // Slack channel without # prefix
    username: process.env.SLACK_USERNAME
};
