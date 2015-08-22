'use strict';

require('array.prototype.find');
var util = require('./util');

var extractPrData = function (pr) {
    // BitBucket api is not returning the PR url for all actions so far (2014-09-26, only create action)
    var getKey = util.getPossiblyUndefinedKeyValue.bind(this, pr);

    var data = {
        prAuthor            : getKey('author.display_name'),
        prUrl               : getKey('links.html.href'),
        prTitle             : getKey('title'),

        user                : getKey('user.display_name'),

        repoName            : getKey('source.repository.name'),
        repoSourceName      : getKey('source.branch.name'),
        repoDestinationName : getKey('destination.branch.name'),

        reason              : getKey('reason'),
        state               : getKey('state'),
        description         : getKey('description'),

        commentUrl          : getKey('links.html.href'),
        commentContentRaw   : getKey('content.raw')
    };

    return data;
};

module.exports = (function () {
    var baseHandler = function (pr) {
        var data = extractPrData(pr);

        var result = {
            fields: [{
                title: data.prTitle,
                value: 'State: ' + data.state + '.',
                short: true
            }, {
                title: 'Repo / Branches:',
                value: data.repoName + ' (' + data.repoSourceName + ' → ' + data.repoDestinationName + ')',
                short: true
            }]
        };

        if (data.reason) {
            result.fields.push({
                title: 'Reason:',
                value: data.reason
            });
        }

        return { result: result, data: data };
    };

    var messageHandlers = {
        created: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: '<' + data.prUrl + '|PR *created* by ' + data.prAuthor + '> for ' + data.repoName + ':',
                color: util.COLORS.blue,
                fields: [{
                    title: data.prTitle,
                    value: data.repoSourceName + ' → ' + data.repoDestinationName
                }, {
                    title: 'Repo / Branches:',
                    value: data.repoName + ' (' + data.repoSourceName + ' → ' + data.repoDestinationName + ')',
                    short: true
                }]
            };

            return result;
        },

        updated: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = 'PR *updated* by ' + data.prAuthor + ' for ' + data.repoName + ':';
            result.color = util.COLORS.blue;

            return result;
        },

        approve: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' *approved* a PR.',
                color: util.COLORS.green
            };

            return result;
        },

        unapprove: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' *UNapproved* a PR.',
                color: util.COLORS.yellow
            };

            return result;
        },

        declined: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;

            result.fallback = 'PR *declined*:';
            result.color = util.COLORS.red;

            return result;
        },

        merged: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;

            result.fallback = 'PR *merged*:';
            result.color = util.COLORS.green;

            return result;
        },

        comment_created: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: data.user + ' *posted* <' + data.commentUrl + '|a comment> on a PR:',
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
                fallback: data.user + ' *deleted* <' + data.commentUrl + '|a comment> on a PR:',
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
                fallback: data.user + ' *updated* <' + data.commentUrl + '|a comment> on a PR:',
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
     * to the notification service. See [0] for the messages Bitbucket
     * may send.
     *
     * 0: https://confluence.atlassian.com/bitbucket/pull-request-post-service-management-385913080.html
     **/
    var generateMessage = function (message) {
        var supportedActions = [
            'created',
            'updated',
            'approve',
            'unapprove',
            'declined',
            'merged',
            'comment_created',
            'comment_deleted',
            'comment_updated'
        ];

        var action = supportedActions.find(function (action) {
            return message['pullrequest_' + action] !== undefined;
        });

        if (!action) {
            console.log('An unknown action was submitted:', message);
            return undefined;
        }

        return messageHandlers[action](message['pullrequest_' + action]);
    };

    return {
        generateMessage: generateMessage
    };
})();
