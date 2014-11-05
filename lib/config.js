'use strict';

require('dotenv').load();

module.exports = {
    port: Number(process.env.PORT) || 5000,
    token: process.env.SLACK_TOKEN, // Slack channel token
    domain: process.env.SLACK_DOMAIN, // Slack domain as in "mycompany.slack.com"
    channel: '#' + process.env.SLACK_CHANNEL, // Slack channel without # prefix
    username: process.env.SLACK_USERNAME || 'MyAwesomeBot'
};
