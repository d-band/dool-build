'use strict';

// Fix https://github.com/postcss/postcss#nodejs-010-and-the-promise-api
require('es6-promise').polyfill();

import rimraf from 'rimraf';
import webpack from 'webpack';
import config from './config';
import progress from './progress';

export default function(args, callback) {
  // Get config.
  const cfg = config(args);

  cfg.plugins.push(progress());

  // Clean output dir first.
  rimraf.sync(cfg.output.path);

  const compiler = webpack(cfg);

  function doneHandler(err, stats) {
    if (!args.watch) {
      // Do not keep cache anymore
      compiler.purgeInputFileSystem();
    }
    if (err) {
      console.error(err.stack || err);
      process.on('exit', function() {
        process.exit(1);
      });
      return callback && callback(err);
    }

    console.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      children: false,
      hash: false,
      version: false
    }));

    if (stats.hasErrors()) {
      err = stats.toJson().errors;
    }

    callback && callback(err);
  }

  // Run compiler.
  if (args.watch) {
    compiler.watch(args.watch || 200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}