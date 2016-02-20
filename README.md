bitbucket-slack-pr-hook
=======================

[![Build Status](https://travis-ci.org/lfilho/bitbucket-slack-pr-hook.svg?branch=master)](https://travis-ci.org/lfilho/bitbucket-slack-pr-hook)

Receive Pull Requests notifications from Bitbucket and send them to Slack.

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

See Bitbucket's official docs: [Pull Request POST hook management](https://confluence.atlassian.com/display/BITBUCKET/Pull+Request+POST+hook+management)

## Caveats

Bitbucket does not provide all necessary data in actions responses. For example, for a `comment_*` action we don't have the PR number, link nor name.
So all we can do is something like "Comment posted for *a* PR" and then the snippet of the comment. But currently there's no way to know where did this comment came from.

## Requirements

  * [Bitbucket](https://bitbucket.org/) repository with admin rights
  * [Slack](https://slack.com/) Incoming Webhook Url: Get your Slack token from your "integrations" page
  * [Node.js](http://nodejs.org/) **OR** [Docker](https://www.docker.com/)

## Configuration

The configuration variables are set with environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).

Environment Variable   | Required | Description | Example
---------------------- | -------- | ----------- | ---------
SLACK_WEBHOOKURL | Y | The incoming hook url found on your Slack team's integration page | https://hooks.slack.com/services/XX/XXX/XXXX
SLACK_USERNAME | N | Username of the Slack bot. If not set, bot will default to integration settings. | BitbucketNotification 
SLACK_CHANNEL | N | Channel to post notifications on. If not set, bot will default to integration settings.  | RepositoryUpdate
HEX_INFO | N | Hex color of updated, and created | #3498db
HEX_DANGER | N | Hex color of declined | #e74c3c
HEX_WARNING | N | Hex color of unapprove, comment: created, comment: deleted, and comment: updated | #f1c40f
HEX_SUCCESS | N | Hex color of merge, and approve | #2ecc71

If you want to use `.env` file, copy the `example.env` as `.env` and modify it as needed. 
Your configuration would look like the example below:

```
PORT=5000
SLACK_WEBHOOKURL=https://hooks.slack.com/services/A123ka9/A123910a9d8/mkas929199sad83lmk7h
SLACK_USERNAME=AwesomeBot
SLACK_CHANNEL=Repository
HEX_SUCCESS=#2ecc71
HEX_DANGER=#e74c3c
```

Note: Setting the `SLACK_USERNAME` or `SLACK_CHANNEL` will override the settings set on the incoming webhook integration page. If you want your team to edit any of these settings without redeploying, do not add them to your `.env` file.

**Important**: if you're going to use a `.env` file AND using Docker, edit it before building the Dockerfile.

When running the service in Docker container, the config values can be provided as parameters:

```
# Starts Docker container in daemonized mode
docker run -e PORT=5000 -e SLACK_TOKEN=123123 \
  -e SLACK_DOMAIN=company -e SLACK_CHANNEL=channel \
  -p 5000:5000 -d bitbucket-slack-pr-hook
```

## Automated Installation
[![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/)
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)    

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
