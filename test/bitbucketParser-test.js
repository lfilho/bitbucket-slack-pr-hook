'use strict';

var buster = require('buster');
// var bitbucketParser = require('../lib/bitbucketParser');

// Make some functions global for BDD style
buster.spec.expose();
var expect = buster.expect;

describe('A module', function () {
    it('states the obvious', function () {
        expect(true).toEqual(true);
    });
});
