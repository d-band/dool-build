'use strict';

const join = require('path').join;
const fs = require('fs');
const glob = require('glob');
const build = require('../lib/build');
const assign = require('object-assign');
const expect = require('chai').expect;

function assert(actualDir, _expect) {
  const expectDir = join(__dirname, 'expect', _expect);
  const actualFiles = glob.sync('**/*', {
    cwd: actualDir,
    nodir: true
  });

  actualFiles.forEach(file => {
    const actualFile = fs.readFileSync(join(actualDir, file), 'utf-8');
    const expectFile = fs.readFileSync(join(expectDir, file), 'utf-8');
    expect(actualFile).to.equal(expectFile);
  });
}

function testBuild(args, fixture, done) {
  const cwd = join(__dirname, 'fixtures', fixture);
  const outputPath = join(cwd, 'dist');
  const defaultConfig = {
    cwd,
    compress: false,
  };

  build(assign({}, defaultConfig, args), err => {
    assert(outputPath, fixture);
    done(err);
  });
}

describe('src/build', function() {
  this.timeout(0);

  it('should support base64', (done) => {
    testBuild({}, 'base64', done);
  });
  it('should support cluster', (done) => {
    testBuild({ cluster: true }, 'cluster', done);
  });
  it('should support common file', (done) => {
    testBuild({}, 'common-file', done);
  });
  it('should support custom loader', (done) => {
    testBuild({}, 'custom-loader', done);
  });
  it('should support custom path', (done) => {
    testBuild({
      hash: true
    }, 'custom-path', done);
  });
  it('should support define', (done) => {
    process.env.NODE_ENV = 'debug';
    testBuild({}, 'define', done);
  });
  it('should support es6', (done) => {
    testBuild({}, 'es6', done);
  });
  it('should support global', (done) => {
    testBuild({}, 'global', done);
  });
  it('should support less', (done) => {
    testBuild({}, 'less', done);
  });
  it('should support load on demand', (done) => {
    testBuild({}, 'load-on-demand', done);
  });
  it('should support map hash', (done) => {
    testBuild({
      hash: true
    }, 'map-hash', done);
  });
  it('should support compress default', (done) => {
    testBuild({
      compress: true
    }, 'compress', done);
  });
  it('should support mix entry and files', (done) => {
    testBuild({}, 'mix-entry', done);
  });
  it('should support react', (done) => {
    testBuild({}, 'react', done);
  });
  it('should throw webpack missing error', (done) => {
    testBuild({}, 'missing', (errors) => {
      done();
    });
  });
  it('should throw error', (done) => {
    console.error = process.exit = function() {};
    testBuild({}, 'error', (err) => {
      expect(err).to.be.an('error');
      done();
    });
  });
});