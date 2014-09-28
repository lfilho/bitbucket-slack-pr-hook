'use strict';

var buster = require('buster');
var fs = require('fs');
var parser = require('../lib/bitbucketParser');

// Make some functions global for BDD style
buster.spec.expose();
var expect = buster.expect;
var readFile = fs.readFileSync.bind();
var COLORS = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00'
};

describe('generateMessage', function () {
    it('should return created message if passed created action', function() {
        var data = JSON.parse(readFile('test/json/created.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();

        expect(out.fallback).toMatch('*created*');
        expect(out.color).toEqual(COLORS.blue);
        expect(out.fields.length).toEqual(2);
    });

    it('should return updated message if passed updated action', function() {
        var data = JSON.parse(readFile('test/json/updated.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();

        expect(out.fallback).toMatch('*updated*');
        expect(out.color).toEqual(COLORS.blue);
        expect(out.fields.length).toEqual(2);
    });

    it('should return approved message if passed approved action', function() {
        var data = JSON.parse(readFile('test/json/approval.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();

        expect(out.fallback).toMatch('*approved*');
        expect(out.color).toEqual(COLORS.green);
        expect(out.fields).not.toBeDefined();
    });

    it('should return unapproved message if passed unapproved action', function() {
        var data = JSON.parse(readFile('test/json/unapprove.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();

        expect(out.fallback).toMatch('*UNapproved*');
        expect(out.color).toEqual(COLORS.yellow);
        expect(out.fields).not.toBeDefined();
    });

    it('should return declined message if passed declined action', function() {
        var data = JSON.parse(readFile('test/json/declined.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();

        expect(out.fallback).toMatch('*declined*');
        expect(out.color).toEqual(COLORS.red);
        expect(out.fields.length).toEqual(3);
    });

    it('should return merged message if passed merged action', function() {
        var data = JSON.parse(readFile('test/json/merged.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();
        expect(out.fallback).toMatch('*merged*');
        expect(out.color).toEqual(COLORS.green);
        expect(out.fields.length).toEqual(2);
    });

    it('should return comment created message if passed comment_created action', function() {
        var data = JSON.parse(readFile('test/json/comment_created.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();
        expect(out.fallback).toMatch('comment');
        expect(out.fallback).toMatch('*posted*');
        expect(out.color).toEqual(COLORS.yellow);
        expect(out.fields.length).toEqual(1);
    });

    it('should return comment deleted message if passed comment_deleted action', function() {
        var data = JSON.parse(readFile('test/json/comment_deleted.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();
        expect(out.fallback).toMatch('comment');
        expect(out.fallback).toMatch('*deleted*');
        expect(out.color).toEqual(COLORS.yellow);
        expect(out.fields.length).toEqual(1);
    });

    it('should return comment updated message if passed comment_updated action', function() {
        var data = JSON.parse(readFile('test/json/comment_updated.json', 'utf8'));
        var out = parser.generateMessage(data);

        expect(out).toBeDefined();
        expect(out.fallback).toMatch('comment');
        expect(out.fallback).toMatch('*updated*');
        expect(out.color).toEqual(COLORS.yellow);
        expect(out.fields.length).toEqual(1);
    });

    it('should return undefined if passed unknown pull request action', function() {
        var out = parser.generateMessage({'unknown': 'dunno'});
        expect(out).not.toBeDefined();
    });
});
