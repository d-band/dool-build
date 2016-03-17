'use strict';

import rimraf from 'rimraf';
import config from './config';
import progress from './progress';
import worker from './worker';
import Pool from 'fork-pool';

export default function(args, callback) {
  // Get config.
  let cfgs = config(args);

  cfgs.forEach(cfg => {
    cfg.plugins.push(progress());
    // Clean output dir first.
    rimraf.sync(cfg.output.path);
  });

  if (args.cluster) {
    let pool = new Pool(`${__dirname}/worker.js`, null, null, {});

    for (let i = 0; i < cfgs.length; i++) {
      pool.enqueue({
        index: i,
        args: args
      }, function(err, res) {});
    }
    
    pool.drain(function() {
      callback && callback();
    });
  } else {
    worker(args, cfgs, callback);
  }
}
