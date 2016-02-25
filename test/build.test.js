jest.autoMockOff();

const join = require('path').join;
const fs = require('fs');
const glob = require('glob');
const build = require('../src/build');
const assign = require('object-assign');
const pwd = process.cwd();

function assert(actualDir, _expect) {
  const expectDir = join(__dirname, 'expect', _expect);
  const actualFiles = glob.sync('**/*', { cwd: actualDir, nodir: true });

  actualFiles.forEach(file => {
    const actualFile = fs.readFileSync(join(actualDir, file), 'utf-8');
    const expectFile = fs.readFileSync(join(expectDir, file), 'utf-8');
    expect(actualFile).toEqual(expectFile);
  });
}

function testBuild(args, fixture) {
  return new Promise(resolve => {
    const cwd = join(__dirname, 'fixtures', fixture);
    const outputPath = join(cwd, 'dist');
    process.chdir(cwd);

    const defaultConfig = {
      cwd,
      compress: false,
    };

    build(assign({}, defaultConfig, args), err => {
      if (err) throw new Error(err);
      assert(outputPath, fixture);
      process.chdir(pwd);
      resolve();
    });
  });
}

describe('src/build', () => {

  pit('should support base64', () => {
    return testBuild({}, 'base64');
  });
  pit('should support common file', () => {
    return testBuild({}, 'common-file');
  });
  pit('should support custom loader', () => {
    return testBuild({}, 'custom-loader');
  });
  pit('should support custom path', () => {
    return testBuild({ hash:true }, 'custom-path');
  });
  pit('should support define', () => {
    process.env.NODE_ENV = 'debug';
    return testBuild({}, 'define');
  });
  pit('should support es6', () => {
    return testBuild({}, 'es6');
  });
  pit('should support global', () => {
    return testBuild({}, 'global');
  });
  pit('should support less', () => {
    return testBuild({}, 'less');
  });
  pit('should support load on demand', () => {
    return testBuild({}, 'load-on-demand');
  });
  pit('should support map hash', () => {
    return testBuild({ hash:true }, 'map-hash');
  });
  pit('should support mix entry and files', () => {
    return testBuild({}, 'mix-entry');
  });
  pit('should support react', () => {
    return testBuild({}, 'react');
  });
});