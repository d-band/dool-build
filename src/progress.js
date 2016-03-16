'use strict';

import { ProgressPlugin } from 'webpack';
import ProgressBar from "progress";

function green(str) {
  return `\x1B[32m${str}\x1B[39m`;
}
function cyan(str) {
  return `\x1B[36m${str}\x1B[39m`;
}

export default function() {
  const bar = new ProgressBar(`${green('[:bar]')} :percent ${cyan(':msg')}`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 100,
    clear: true
  });

  return new ProgressPlugin(function handler(percentage, msg) {
    if (percentage === 1) {
      bar.terminate();
      console.log(green('Build completed.\n'));
    } else {
      bar.update(percentage, {
        msg: msg
      });
    }
  });
}