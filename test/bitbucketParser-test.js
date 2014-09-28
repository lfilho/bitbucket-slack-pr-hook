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
        readFile('test/json/created.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*created*');
            expect(out.color).toEqual(util.COLORS.blue);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should return updated message if passed updated action', function (done) {
        readFile('test/json/updated.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

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
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*approved*');
            expect(out.color).toEqual(util.COLORS.green);
            expect(out.fields).not.toBeDefined();

            done();
        });
    });

    it('should return unapproved message if passed unapproved action', function (done) {
        readFile('test/json/unapprove.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*UNapproved*');
            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields).not.toBeDefined();

            done();
        });
    });

    it('should return declined message if passed declined action', function (done) {
        readFile('test/json/declined.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();

            expect(out.fallback).toMatch('*declined*');
            expect(out.color).toEqual(util.COLORS.red);
            expect(out.fields.length).toEqual(3);

            done();
        });
    });

    it('should return merged message if passed merged action', function (done) {
        readFile('test/json/merged.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('*merged*');
            expect(out.color).toEqual(util.COLORS.green);
            expect(out.fields.length).toEqual(2);

            done();
        });
    });

    it('should return comment created message if passed comment_created action', function (done) {
        readFile('test/json/comment_created.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*posted*');
            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields.length).toEqual(1);

            done();
        });
    });

    it('should return comment deleted message if passed comment_deleted action', function (done) {
        readFile('test/json/comment_deleted.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*deleted*');
            expect(out.color).toEqual(util.COLORS.yellow);
            expect(out.fields.length).toEqual(1);

            done();
        });
    });

    it('should return comment updated message if passed comment_updated action', function (done) {
        readFile('test/json/comment_updated.json', function (err, data) {
            data = JSON.parse(data);
            var out = parser.generateMessage(data);

            expect(out).toBeDefined();
            expect(out.fallback).toMatch('comment');
            expect(out.fallback).toMatch('*updated*');
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
});
