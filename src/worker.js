'use strict';

import { red } from './color';
import webpack from 'webpack';
import config from './config';
import progress from './progress';

// Fix https://github.com/postcss/postcss#nodejs-010-and-the-promise-api
require('es6-promise').polyfill();

if (process.send) {
  process.on('message', msg => {
    const cfg = config(msg.args)[msg.index];
    run(msg.args, [cfg], (err, stats) => {
      process.send(err ? red(err.stack) : stats);
    });
  });
}

export default function run (args, cfgs, callback) {
  // add progress plugin
  cfgs.forEach(cfg => {
    cfg.plugins.push(progress());
  });
  const compiler = webpack(cfgs);

  // Hack: remove extract-text-webpack-plugin log
  args.verbose || compiler.plugin('done', stats => {
    stats.stats.forEach((stat) => {
      stat.compilation.children = stat.compilation.children.filter((child) => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
  });

  function doneHandler (err, stats) {
    if (err) {
      process.on('exit', () => process.exit(2));
      return callback && callback(err);
    }

    if (stats.hasErrors()) {
      process.on('exit', () => process.exit(1));
    }

    callback && callback(null, stats.toString({
      colors: true,
      children: true,
      chunks: !!args.verbose,
      modules: !!args.verbose,
      chunkModules: !!args.verbose,
      hash: !!args.verbose,
      version: !!args.verbose
    }));
  }

  // Run compiler.
  if (args.watch) {
    compiler.watch(args.watch || 200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}
