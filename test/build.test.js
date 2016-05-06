'use strict';

var join = require('path').join;
var fs = require('fs');
var glob = require('glob');
var build = require('../lib/build');
var assign = require('object-assign');
var expect = require('chai').expect;

function assert(actualDir, _expect) {
  var expectDir = join(__dirname, 'expect', _expect);
  var actualFiles = glob.sync('**/*', {
    cwd: actualDir,
    nodir: true
  });

  actualFiles.forEach(function(file) {
    var actualFile = fs.readFileSync(join(actualDir, file), 'utf-8');
    var expectFile = fs.readFileSync(join(expectDir, file), 'utf-8');
    expect(actualFile).to.equal(expectFile);
  });
}

function testBuild(args, fixture, done) {
  var cwd = join(__dirname, 'fixtures', fixture);
  var outputPath = join(cwd, 'dist');
  var defaultConfig = {
    cwd: cwd,
    compress: false,
  };

  build(assign({}, defaultConfig, args), function(err) {
    assert(outputPath, fixture);
    done(err);
  });
}

describe('src/build', function() {
  this.timeout(0);

  it('should support base64', function(done) {
    testBuild({}, 'base64', done);
  });
  it('should support cluster', function(done) {
    testBuild({ cluster: true }, 'cluster', done);
  });
  it('should support common file', function(done) {
    testBuild({}, 'common-file', done);
  });
  it('should support custom loader', function(done) {
    testBuild({}, 'custom-loader', done);
  });
  it('should support custom path', function(done) {
    testBuild({
      hash: true
    }, 'custom-path', done);
  });
  it('should support define', function(done) {
    process.env.NODE_ENV = 'debug';
    testBuild({}, 'define', done);
  });
  it('should support es6', function(done) {
    testBuild({}, 'es6', done);
  });
  it('should support global', function(done) {
    testBuild({}, 'global', done);
  });
  it('should support less', function(done) {
    testBuild({}, 'less', done);
  });
  it('should support load on demand', function(done) {
    testBuild({}, 'load-on-demand', done);
  });
  it('should support map hash', function(done) {
    testBuild({
      hash: true
    }, 'map-hash', done);
  });
  it('should support compress default', function(done) {
    testBuild({
      compress: true
    }, 'compress', done);
  });
  it('should support mix entry and files', function(done) {
    testBuild({}, 'mix-entry', done);
  });
  it('should support react', function(done) {
    testBuild({}, 'react', done);
  });
  it('should throw webpack missing error', function(done) {
    testBuild({}, 'missing', function(errors) {
      done();
    });
  });
  it('should throw error', function(done) {
    console.error = process.exit = function() {};
    testBuild({}, 'error', function(err) {
      expect(err).to.be.an('error');
      done();
    });
  });
});