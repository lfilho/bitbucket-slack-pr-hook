bitbucket-slack-pr-hook
=======================

[![Build Status](https://app.travis-ci.com/berkayturanci/bitbucket-slack-pr-hook.svg?branch=master)](https://app.travis-ci.com/berkayturanci/bitbucket-slack-pr-hook)

Receive Pull Requests notifications from Bitbucket and send them to Slack.

## Features

As for 2021-10-01 we support following BitBucket's PR action types payloads:

  * Opened
  * Modified
  * Approved
  * Unapproved
  * Needs work
  * Merged
  * Declined
  * Deleted
  * Comment added
  * Comment edited
  * Comment deleted

See Bitbucket's official docs: [Event Payload](https://confluence.atlassian.com/bitbucketserver0710/event-payload-1044105208.html?utm_campaign=in-app-help&utm_medium=in-app-help&utm_source=stash#Eventpayload-pullrequest)

## Requirements

  * [Bitbucket](https://bitbucket.org/) repository with admin rights
  * [Slack](https://slack.com/) Incoming Webhook Url: Get your Slack token from your "integrations" page
  * [Node.js](http://nodejs.org/) **OR** [Docker](https://www.docker.com/)

## Optional Features

### Mention Reviewers

If you want to automatically notify the PR reviewers on slack messages, you can set to `true` the environment variable `MENTION_REVIEWERS`.

In order to mention users properly USER list should be provided too from variables. If USERS not provided then mentioning will not work properly.

### Mention PR Owners

If you want to automatically notify the PR owners on slack messages once comment actions occur, you can set to `true` the environment variable `MENTION_OWNERS`.

In order to mention users properly USER list should be provided too from variables. If USERS not provided then mentioning will not work properly.

### Users

For Mentioning users properly, we need users slack user id. Since bitbucket gives bitbucket user id, there should be a match. 

To provide users in the system you can use `USERS` environment variable as the following; "BITBUCKET_USER_NAME|SLACK_USER_ID, BITBUCKET_USER_NAME|SLACK_USER_ID, BITBUCKET_USER_NAME|SLACK_USER_ID, ..."

### Use Emojis

We all like emojis. To add emoji icons to your PR actions use this environment variable. Setting `true` to the `USE_EMOJIS` environment variable will enable this.

This only add emojis to messages with %33 chance. If you want emojis always on messages check the following flag.

For the color red following emojis used; `:ahhhhhhhhh:`, `:fire:`, `:boom:` ; :ahhhhhhhhh:, :fire:, :boom:
For the color green following emojis used; `:bob_ross_parrot:`, `:success:`, `:cool-doge:`, `:conga-parrot:`, `:birthday_party_parrot:`, `:bananadance_lsd:` ; ":bob_ross_parrot:", ":success:", ":cool-doge:", ":conga-parrot:", ":birthday_party_parrot:", ":bananadance_lsd:"
For the color yellow following emojis used; `:warning:`, `:confused_dog:`, `:mild-panic-intensifies:`; ":warning:", ":confused_dog:", ":mild-panic-intensifies:"
For the color blue following emojis used; `:information_source:`, `:speech_balloon:` ; ":information_source:", ":speech_balloon:"

Some emojis are custom emojis where you may need to add to your slack workspace. Sorry emojis cannot be changed currently.

### Use Emoji Always

This flag will enable to use emojis in all messages without chance factor. You can set to `true` the environment variable `EMOJI_ALWAYS`.

Only setting this environment variable will not work, you have to enable `USE_EMOJIS` too.

## Configuration

The configuration variables are set with environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).

Environment Variable   | Required | Description | Example
---------------------- | -------- | ----------- | ---------
SLACK_WEBHOOK | Y | The incoming hook url found on your Slack team's integration page | https://hooks.slack.com/services/XX/XXX/XXXX
SLACK_USERNAME | N | Username of the Slack bot. If not set, bot will default to integration settings. | BitbucketNotification
SLACK_CHANNEL | N | Channel to post notifications on. If not set, bot will default to integration settings.  | RepositoryUpdate
MENTION_REVIEWERS | N | Set to true if you want to mention reviewers in slack channel | false
MENTION_OWNERS | N | Set to true if you want to mention pr owners in slack channel | false
USE_EMOJIS | N | Set to true if you want to have emojis in slack messages with %33 chance | false
EMOJI_ALWAYS | N | Set to true if you want to have emojis in all slack messages without chance factor | false
USERS | N | Set a list of users with "BITBUCKET_USER_NAME|SLACK_USER_ID, ..." if you want to notify users properly in slack messages | Empty String
HEX_INFO | N | Hex color of updated, and created | #3498db
HEX_DANGER | N | Hex color of declined | #e74c3c
HEX_WARNING | N | Hex color of unapprove, comment: created, comment: deleted, and comment: updated | #f1c40f
HEX_SUCCESS | N | Hex color of merge, and approve | #2ecc71

If you want to use `.env` file, copy the `example.env` as `.env` and modify it as needed.
Your configuration would look like the example below:

```
PORT=5000
SLACK_WEBHOOK=https://hooks.slack.com/services/XX/XXX/XXXX
SLACK_USERNAME=AwesomeBot
SLACK_CHANNEL=Repository
HEX_SUCCESS=#2ecc71
HEX_DANGER=#e74c3c
MENTION_OWNERS=true
USE_EMOJIS=true
EMOJI_ALWAYS=true
USERS=BITBUCKET_USER_NAME|SLACK_USER_ID, BITBUCKET_USER_NAME|SLACK_USER_ID, BITBUCKET_USER_NAME|SLACK_USER_ID
```

Note: Setting the `SLACK_USERNAME` or `SLACK_CHANNEL` will override the settings set on the incoming webhook integration page. If you want your team to edit any of these settings without redeploying, do not add them to your `.env` file.

**Important**: if you're going to use a `.env` file AND using Docker, edit it before building the Dockerfile. Or you can add environment flags on running the container.

When running the service in Docker container, the config values can be provided as parameters:

```
# Starts Docker container in daemonized mode

docker run -e PORT=5000 -e SLACK_WEBHOOK=https://hooks.slack.com/services/XX/XXX/XXXX \
  -e USE_EMOJIS=true -e EMOJI_ALWAYS=true -e MENTION_OWNERS=true -e MENTION_REVIEWERS=true \
  -e USERS="BITBUCKET_USER_NAME1|SLACK_USER_ID1, BITBUCKET_USER_NAME2|SLACK_USER_ID2, BITBUCKET_USER_NAME3|SLACK_USER_ID3" \
  -e MENTION_REVIEWERS=true -p 5000:5000 -d bitbucket-slack-pr-hook 
  
```

## Installation From Docker Hub
[Docker Hub Image](https://hub.docker.com/r/berkayturanci/bitbucket-slack-pr-hook)

## Manual Installation
- [Local Infrastructure or Cloud Services](#local-infrastructure-or-cloud-services)
- [Docker](#docker)

### Local Infrastructure or Cloud Services

  1. Set up a server address in your local infrastructure that will serve this application (eg: `slackapi.mycompany.com` or `slackapi.heroku.com`)
  2. Clone/download this repo to your chosen server
  3. Configure your application according to the "Configuration" section above
  4. Install NodeJS if you don't have it
  5. Run `npm install` in the app's root folder

**Important note**: make sure you don't have any firewall blocking the incoming TCP port (default is PORT 5000 as defined in the "Configuration" section above)

### Docker
Service can also be installed & deployed using [Docker](https://www.docker.com/) containers,
which makes it easy to setup the environment without worrying about the requirements.

  1. Clone/download this repo
  2. Install Docker (using system packages in Linux, in Windows or Mac OS X you can use [Boot2docker](http://boot2docker.io/))
  3. Start Docker service (or `boot2docker up`)
  4. Build the Docker image:

        # Alternatively: npm run build-container
        docker build -t bitbucket-slack-pr-hook .

  5. Start container with appropriate `-e` config parameters:

        docker run -e PORT=5000 -e SLACK_WEBHOOK=webhookurl \
          -p 5000:5000 -d bitbucket-slack-pr-hook

  6. Ensure the container is running (you should also be able to access the service using web browser: `http://<dockerhost>:5000/`).

     **Note:** In Linux the `<dockerhost>` is `localhost`, with Boot2docker use the IP reported by the command: `boot2docker ip`

## Setting up the Bitbucket Repository

  1. In your main Bitbucket repository, go to Settings > Hooks and create a new `Pull Request POST` hook
  2. Set up the URL as `http://<server>:<port>{/<channel>}`.
    * `<server>` is your host FQDN or its IP address
    * `<port>` is either 5000 or any other you defined in the configuration section
    * `<channel>` is an optional Slack channel where you want to receive this specific notifications - if it's not defined here it will use the one you defined in Configuration -section.

## Activate

### Via plain node

  1. Run `npm start` (or `node server.js`) to fire up the application (you can do `node server.js &` to run it as a daemon in your Linux box)

### Via Docker

  1. Run `npm run build-container` to build the container
  2. Run `npm run start-container` to start the container and the server inside it
  3. When needed, you can use `npm run stop-container` and `npm run reload-container`

## Credits

This repo was inspired by: https://github.com/kfr2/bitbucket-pull-request-connector
