#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version(require('./package').version, '-v, --version')
  .option('-o, --output-path <path>', 'output path')
  .option('-P, --public-path <path>', 'public path')
  .option('-w, --watch [delay]', 'watch file changes and rebuild')
  .option('--hash', 'build with hash and output map.json')
  .option('--devtool <devtool>', 'sourcemap generate method, default is null')
  .option('--config <path>', 'custom config path, default is webpack.config.js')
  .option('--no-compress','build without compress')
  .option('--cluster', 'run in multi process.')
  .option('--verbose', 'show more details.')
  .parse(process.argv);

program.cwd = process.cwd();

require('./lib/build')(program);
