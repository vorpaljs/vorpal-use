'use strict';

require('assert');

var should = require('should');
var Vorpal = require('vorpal');
var use = require('./../lib/index');

var vorpal;
var stdout = '';

function pipeFn(data) {
  stdout += data;
  return '';
}

function stdoutFn() {
  var result = stdout;
  stdout = '';
  return result;
}

describe('vorpal-use', function () {
  before('vorpal preps', function () {
    vorpal = new Vorpal()
      .pipe(pipeFn)
      .show();
  });

  beforeEach('vorpal preps', function () {
    stdout = '';
  });

  it('should exist and be a function', function () {
    should.exist(use);
    use.should.be.type('function');
  });

  it('should import into Vorpal', function () {
    (function () {
      vorpal.use(use);
    }).should.not.throw();
  });

  it('should install a live vorpal-module', function (done) {
    this.timeout(90000);
    vorpal.exec('use vantage-hacker-news').then(function () {
      var out = stdoutFn();
      out.should.containEql('Successfully registered');
      done();
    }).catch(function (err, data) {
      console.log(stdoutFn());
      console.log(err, data);
      done(err);
    });
  });

  it('should run the live vorpal-module\'s command', function (done) {
    this.timeout(20000);
    vorpal.exec('hacker-news').then(function () {
      stdoutFn().should.containEql('points by');
      done();
    }).catch(function (err) {
      done(err);
    });
  });
});
