'use strict';

import { red, green } from './color';
import rimraf from 'rimraf';
import config from './config';
import worker from './worker';
import Pool from 'fork-pool';

function info (str) {
  console.log(green('\nBuild completed  🎉\n'));
  console.log(str);
}

function error (str) {
  console.error(red('\nBuild failed  💥\n'));
  console.error(red(str));
}

export default (args, callback) => {
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
      }, (err, res) => {
        if (err) return;
        output.push(res.stdout);
      });
    }

    pool.drain(() => {
      info(output.join('\n'));
      callback && callback();
    });
  } else {
    worker(args, cfgs, (err, stats) => {
      err ? error(err.stack) : info(stats);
      callback && callback(err);
    });
  }
};
