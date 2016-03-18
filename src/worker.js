'use strict';

// Fix https://github.com/postcss/postcss#nodejs-010-and-the-promise-api
require('es6-promise').polyfill();

import webpack from 'webpack';
import config from './config';

if (process.send) {
  process.on('message', function(msg) {
    console.log(`[Worker] Start #${msg.index + 1}`);
    const cfg = config(msg.args)[msg.index];
    run(msg.args, cfg, function(err) {
      process.send(err ? 'fail' : 'done');
    });
  });
}

export default function run(args, cfg, callback) {
  const compiler = webpack(cfg);

  // Hack: remove extract-text-webpack-plugin log
  compiler.plugin('done', function(stats) {
    stats.stats.forEach((stat) => {
      stat.compilation.children = stat.compilation.children.filter((child) => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
  });

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
      children: true,
      chunks: !!args.verbose,
      modules: !!args.verbose,
      chunkModules: !!args.verbose,
      hash: !!args.verbose,
      version: !!args.verbose
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
