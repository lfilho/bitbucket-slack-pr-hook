'use strict';

var buster = require('buster');
var fs = require('fs');
var parser = require('../lib/bitbucketParser');
var util = require('../lib/util');

// Make some functions global for BDD style
buster.spec.expose();
var expect = buster.expect;
var readFile = function (file, callback) {
    return fs.readFile(file, { encoding: 'utf8' }, callback);
};

describe('generateMessage', function () {
    it('should return created message if passed created action', function (done) {
        readFile('test/json/general.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:created');

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*created*');
            expect(out.fallback).toMatch('https://bitbucket.org/brh55/bitbucket-pullrequest-mock/pull-requests/6');
            expect(out.color).toEqual(util.COLORS.blue);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should have reviewers mentions in created message if mentionReviewers switch is true', function (done) {
        readFile('test/json/general.json', function (err, data) {
            data = JSON.parse(data);
            util.FEATURE_SWITCH.mentionReviewers = true;
            var out = parser.generateMessage(data, 'pullrequest:created');

            expect(out).toBeDefined();
            expect(out.fields.length).toEqual(3);

            util.FEATURE_SWITCH.mentionReviewers = false;
            done();
        });
    });

    it('should return updated message if passed updated action', function (done) {
        readFile('test/json/general.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:updated');

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*updated*');
            expect(out.color).toEqual(util.COLORS.blue);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should return approved message if passed approved action', function (done) {
        readFile('test/json/approval.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:approved');

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*approved*');
            expect(out.fallback).toMatch('Vladamir Jones');
            expect(out.color).toEqual(util.COLORS.green);
            expect(out.fields).not.toBeDefined();

            done();
        });
    });

    it('should return unapproved message if passed unapproved action', function (done) {
        readFile('test/json/approval.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:unapproved');

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*UNapproved*');
            expect(out.fallback).toMatch('Vladamir Jones');

            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields).not.toBeDefined();

            done();
        });
    });

    it('should return rejected message if passed rejected action', function (done) {
        readFile('test/json/general.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:rejected');

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*rejected*');
            expect(out.color).toEqual(util.COLORS.red);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should return merged message if passed merged action', function (done) {
        readFile('test/json/general.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:fulfilled');

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('*merged*');
            expect(out.color).toEqual(util.COLORS.green);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should return comment created message if passed comment_created action', function (done) {
        readFile('test/json/comment.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:comment_created');

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*posted*');
            expect(out.fallback).toMatch('Vladamir Jones');
            expect(out.fallback).toMatch('https://bitbucket.org/brh55/bitbucket-pullrequest-mock/pull-requests/6/_/diff#comment-13165480');

            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields.length).toEqual(1);

            done();
        });
    });

    it('should return comment deleted message if passed comment_deleted action', function (done) {
        readFile('test/json/comment.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:comment_deleted');

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*deleted*');
            expect(out.fallback).toMatch('Vladamir Jones');
            expect(out.fallback).toMatch('https://bitbucket.org/brh55/bitbucket-pullrequest-mock/pull-requests/6/_/diff#comment-13165480');

            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields.length).toEqual(1);

            done();
        });
    });

    it('should return comment updated message if passed comment_updated action', function (done) {
        readFile('test/json/comment.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data, 'pullrequest:comment_updated');

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*updated*');
            expect(out.fallback).toMatch('Vladamir Jones');
            expect(out.fallback).toMatch('https://bitbucket.org/brh55/bitbucket-pullrequest-mock/pull-requests/6/_/diff#comment-13165480');

            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields.length).toEqual(1);

            done();
        });
    });

    it('should return undefined if passed unknown pull request action', function () {
        this.stub(console, 'log');
        var out = parser.generateMessage({'unknown': 'dunno'});
        expect(out).not.toBeDefined();
    });

    it('should return undefined if a non pullrequest event is submitted', function () {
        this.stub(console, 'log');
        var out = parser.generateMessage({'unknown': 'dunno'}, 'repo:fork');
        expect(out).not.toBeDefined();
    });
});
