#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version(require('./package').version, '-v, --version')
  .option('-o, --output-path <path>', 'output path')
  .option('-w, --watch [delay]', 'watch file changes and rebuild')
  .option('--hash', 'build with hash and output map.json')
  .option('--devtool <devtool>', 'sourcemap generate method, default is null')
  .option('--config <path>', 'custom config path, default is webpack.config.js')
  .option('--no-compress','build without compress')
  .parse(process.argv);

program.cwd = process.cwd();

// Fix https://github.com/postcss/postcss#nodejs-010-and-the-promise-api
require('es6-promise').polyfill();

require('./lib/build')(program);
