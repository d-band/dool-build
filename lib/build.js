'use strict';

const rimraf = require('rimraf');
const webpack = require('webpack');
const config = require('./config');

module.exports = function(args, callback) {
  // Get config.
  const cfg = config(args);

  // Clean output dir first.
  rimraf.sync(cfg.output.path);

  const compiler = webpack(cfg);

  let lastHash = null;

  function doneHandler(err, stats) {
    if (!args.watch) {
      compiler.purgeInputFileSystem();
    }
    if (err) {
      lastHash = null;
      console.error(err.stack || err);
      if (err.details) console.error(err.details);
      if (!args.watch) {
        process.on('exit', function() {
          process.exit(1);
        });
      }
      return;
    }
    if (stats.hash !== lastHash) {
      lastHash = stats.hash;
      process.stdout.write(stats.toString({
        colors: true,
        chunks: false,
        modules: false,
        chunkModules: false
      }) + '\n');
    }
  }

  // Run compiler.
  if (args.watch) {
    compiler.watch(args.watch || 200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}