bitbucket-slack-pr-hook
=======================

Receive Pull Requests notifications from BitBucket and sends them to Slack.

## Features

As for 2014-09-26 we support all BitBucket's action types:

  * created
  * updated
  * approve
  * unapprove
  * declined
  * merged
  * comment_created
  * comment_deleted
  * comment_updated

BitBucket's oficial docs: https://confluence.atlassian.com/display/BITBUCKET/Pull+Request+POST+hook+management

## Caveats

BitBucket does not provide all necessary data in actions responses. For example, for a `comment_*` action we don't have the PR number, link nor name.
So all we can do is something like "Comment posted for *a* PR" and then the snippet of the comment. But currently there's no way to know where did this comment came from.

## Configuration

The default port number is `5000` but you can change it in your enviorment like so:
`PORT=1234 node server.js`

The rest of configuration is done inside `config.js`. Example:

```
token: 'abcdefghijklmnopqrstuvxz',
domain: 'mycompany', // As in "mycompany.slack.com"
channel: '#myChannel',
username: 'MyAwesomeBot'
```

Rename `config-dist.js` to `config.js` and alter the values according to your needs.

## Installation

You can install it in your own local infraestructure or in a cloud service like heroku.

  1. Get your Slack token from your "integrations" page
  2. Set up a server address in your local infraestructure that will serve this application (eg: `slackapi.mycompany.com` or `slackapi.heroku.com`)
  3. Clone/download this repo to your chosen server
  4. Configure your application according to the section "Configuration" above
  5. Install NodeJS if you don't have it
  6. Run `npm install` in the app's root folder
  7. Run `node server.js` (or `npm start`) and you are ready to roll.

## Credits

This repo was inspired by: https://github.com/kfr2/bitbucket-pull-request-connector
