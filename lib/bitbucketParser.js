'use strict';

require('array.prototype.find');
var util = require('./util');

/**
 * Extracts the payload recieved from Bitbucket outgoing hooks.
 *
 *
 * @param  {object} pr Pull Request
 * @return {object}    Data object mapped with key information
 */
var extractPrData = function (pr) {
    // BitBucket api is not returning the PR url for all actions so far (2014-09-26, only create action)
    var getKey = util.getPossiblyUndefinedKeyValue.bind(this, pr);

    var data = {
        prAuthor            : getKey('pullrequest.author.display_name'),
        prUrl               : getKey('pullrequest.links.html.href'),
        prTitle             : getKey('pullrequest.title'),
        prNumber            : getKey('pullrequest.id'),

        user                : getKey('actor.display_name'),

        repoName            : getKey('pullrequest.source.repository.name'),
        repoSourceName      : getKey('pullrequest.source.branch.name'),
        repoDestinationName : getKey('pullrequest.destination.branch.name'),

        reason              : getKey('repository.reason'),
        state               : getKey('repository.state'),
        description         : getKey('repository.description'),

        commentUrl          : getKey('comment.links.html.href'),
        commentContentRaw   : getKey('comment.content.raw')
    };

    return data;
};

module.exports = (function () {
    var baseHandler = function (pr) {
        var data = extractPrData(pr);

        var result = {
            fields: [{
                title: 'Branches:',
                value: data.repoName + ': ' + data.repoSourceName + ' → ' + data.repoDestinationName
            }]
        };

        return { result: result, data: data };
    };

    var messageHandlers = {
        created: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: 'Pull Request ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> opened by ' + data.prAuthor + ' for ' + data.repoName + ':',
                color: util.COLORS.blue,
                fields: [{
                    title: 'Branches:',
                    value: data.repoName + ': ' + data.repoSourceName + ' → ' + data.repoDestinationName
                }]
            };

            return result;
        },

        updated: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = '' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> updated by ' + data.prAuthor + ' for ' + data.repoName + ':';
            result.color = util.COLORS.blue;

            return result;
        },

        approved: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' approved ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> for ' + data.repoName,
                color: util.COLORS.green
            };

            return result;
        },

        unapproved: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' unapproved ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> for ' + data.repoName,
                color: util.COLORS.yellow
            };

            return result;
        },

        rejected: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> was rejected by ' + data.user;
            result.color = util.COLORS.red;

            if (data.reason) {
                result.fields.push([
                    {
                        title: 'Reason',
                        value: util.truncate(data.reason)
                    }
                ]);
            }

            return result;
        },

        fulfilled: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '> was merged by ' + data.user;
            result.color = util.COLORS.green;

            return result;
        },

        comment_created: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' commented on ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '>',
                color: util.COLORS.yellow,
                fields: [{
                    value: util.truncate(data.commentContentRaw)
                }]
            };

            return result;
        },

        comment_deleted: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' deleted a comment on ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '>',
                color: util.COLORS.yellow,
                fields: [{
                    value: util.truncate(data.commentContentRaw)
                }]
            };

            return result;
        },

        comment_updated: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' updated a comment on ' + data.repoName + '<' + data.prUrl + '|#' + data.prNumber + ' ' + data.prTitle + '>',
                color: util.COLORS.yellow,
                fields: [{
                    value: util.truncate(data.commentContentRaw)
                }]
            };

            return result;
        }
    };

     /**
      * Examine the message from Bitbucket to determine the message to send
      * to the notification service. See [0] for more information regarding available events..
      *
      * [0]: https://confluence.atlassian.com/bitbucket/event-payloads-740262817.html
      *
      * @param  {object} message  Payload of the webhook HTTP request
      * @param  {string} eventKey Event-Key identified by webhook HTTP header
      */
    var generateMessage = function (message, eventKey) {
        eventKey = eventKey || '';
        var delimiter = eventKey.indexOf(':');
        var context = eventKey.substring(0, delimiter);

        if (context !== 'pullrequest') {
            console.log('Receiving events for ', context);
            return undefined;
        }

        eventKey = eventKey.substring(delimiter + 1, eventKey.length);

        var supportedEvents = [
            'created',
            'updated',
            'rejected',
            'fulfilled',
            'approved',
            'unapproved',
            'comment_created',
            'comment_updated',
            'comment_deleted'
        ];

        if (!eventKey || supportedEvents.indexOf(eventKey) < -1) {
            console.log('An unknown action was submitted:', message);
            return undefined;
        }

        return messageHandlers[eventKey](message);
    };

    return {
        generateMessage: generateMessage
    };
})();
