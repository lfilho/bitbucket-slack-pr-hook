'use strict';

require('array.prototype.find');
var util = require('./util');

/**
 * Extracts the payload received from Bitbucket outgoing hooks.
 *
 *
 * @param  {object} pr Pull Request
 * @return {object}    Data object mapped with key information
 */
var extractPrData = function (pr) {
    // BitBucket api is not returning the PR url for all actions so far (2014-09-26, only create action)
    var getKey = util.getPossiblyUndefinedKeyValue.bind(this, pr);

    return {
        prAuthor: getKey('pullRequest.author.user.displayName'),
        prUrl: getKey('pullRequest.links.self'),
        prTitle: getKey('pullRequest.title'),

        user: getKey('actor.displayName'),

        repoName: getKey('pullRequest.fromRef.repository.name'),
        repoSourceName: getKey('pullRequest.fromRef.displayId'),
        repoDestinationName: getKey('pullRequest.toRef.displayId'),

        state: getKey('pullRequest.state'),
        description: getKey('pullRequest.description'),

        commentId: getKey('comment.id'),
        commentText: getKey('comment.text'),

        reviewers: getKey('pullRequest.reviewers')
    };
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

        return {result: result, data: data};
    };

    var messageHandlers = {
        opened: function (pr) {
            var data = extractPrData(pr);

            var result = {
                fallback: '<' + data.prUrl[0].href + '|PR *created* by ' + data.prAuthor + '> for ' + data.repoName + ':',
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

            if (util.FEATURE_SWITCH.mentionReviewers && data.reviewers && data.reviewers.length > 0) {
                var reviewersStr = '';
                data.reviewers.forEach(function (reviewer) {
                    reviewersStr += ' <@' + reviewer.user.displayName + '>';
                });
                result.fields.push({
                    title: 'Reviewers:',
                    value: reviewersStr.trim()
                });
            }

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        modified: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = '<' + data.prUrl[0].href + '|PR *updated* by ' + data.prAuthor + '> for ' + data.repoName + ':';
            result.color = util.COLORS.blue;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        declined: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = '<' + data.prUrl[0].href + '|PR *declined* by ' + data.prAuthor + '> for ' + data.repoName + ':';
            result.color = util.COLORS.yellow;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        deleted: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = '<' + data.prUrl[0].href + '|PR *deleted* by ' + data.prAuthor + '> for ' + data.repoName + ':';
            result.color = util.COLORS.red;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        approved: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' <' + data.prUrl[0].href + '|*approved* a PR.>';
            result.color = util.COLORS.green;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        unapproved: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' <' + data.prUrl[0].href + '| *Unapproved* a PR.>';
            result.color = util.COLORS.yellow;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        needs_work: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' thinks ' + '<' + data.prUrl[0].href + '|PR *needs work*.>';
            result.color = util.COLORS.red;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        merged: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = '<' + data.prUrl[0].href + '|PR>' + ' *merged*:';
            result.color = util.COLORS.green;

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        cadded: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' *posted* <' + util.commentUrl(data.prUrl[0].href, data.commentId) + '|a comment on a PR.>:';
            result.color = util.COLORS.blue;
            result.fields.push({
                title: 'Added Comment:',
                value: util.truncate(data.commentText),
                short: true
            });

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        cedited: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' *updated* <' + util.commentUrl(data.prUrl[0].href, data.commentId) + '|a comment on a PR.>:';
            result.color = util.COLORS.blue;
            result.fields.push({
                title: 'Edited Comment:',
                value: util.truncate(data.commentText),
                short: true
            });

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
        },

        cdeleted: function (pr) {
            var handled = baseHandler(pr);
            var result = handled.result;
            var data = handled.data;

            result.fallback = data.user + ' *deleted* <' + util.commentUrl(data.prUrl[0].href, data.commentId) + '|a comment on a PR.>:';
            result.color = util.COLORS.red;
            result.fields.push({
                title: 'Deleted Comment:',
                value: util.truncate(data.commentText),
                short: true
            });

            return util.FEATURE_USE_EMOJI.useEmojis ? util.addEmoji(result) : result;
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

        if (context !== 'pr') {
            console.log('Receiving events for ', context);
            return undefined;
        }

        eventKey = eventKey.replace("comment:", "c");
        eventKey = eventKey.split(':').pop();

        var supportedEvents = [
            'opened',
            'modified',
            'declined',
            'deleted',
            'merged',

            'approved',
            'needs_work',
            'unapproved',

            'cadded',
            'cedited',
            'cdeleted'
        ];

        if (!eventKey || supportedEvents.indexOf(eventKey) === -1) {
            console.log('An unknown action was submitted:', message);
            return undefined;
        }

        return messageHandlers[eventKey](message);
    };

    return {
        generateMessage: generateMessage
    };
})();
