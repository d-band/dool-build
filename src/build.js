'use strict';

import { red, green } from './color';
import rimraf from 'rimraf';
import config from './config';
import worker from './worker';
import Pool from 'fork-pool';

function log(str) {
  console.log(green('\nBuild completed  🎉\n'));
  console.log(str);
}

export default function(args, callback) {
  // Get config.
  let cfgs = config(args);

  // Clean output dir first.
  cfgs.forEach(cfg => {
    rimraf.sync(cfg.output.path);
  });

  if (args.cluster) {
    let output = [];
    let pool = new Pool(`${__dirname}/worker.js`, null, null, {});

    for (let i = 0; i < cfgs.length; i++) {
      pool.enqueue({
        index: i,
        args: args
      }, function(err, res) {
        output.push(res.stdout);
      });
    }

    pool.drain(function() {
      log(output.join('\n'));
      callback && callback();
    });
  } else {
    worker(args, cfgs, function(err, stats) {
      log(err ? red(err.stack) : stats);
      callback && callback(err);
    });
  }
}
