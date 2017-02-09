'use strict';

import { green, cyan } from './color';
import { ProgressPlugin } from 'webpack';

export default function () {
  const total = 20;
  const stream = process.stderr;
  const fmt = `${green('[:bar]')} :percent ${cyan(':msg')}`;

  return new ProgressPlugin(function handler (percent, msg) {
    if (!stream.isTTY) return;

    let beforeLen = Math.floor(percent * total);
    let afterLen = total - beforeLen;
    let before = Array(beforeLen).join('=');
    let after = Array(afterLen).join(' ');

    let str = fmt
      .replace(':bar', before + after)
      .replace(':percent', (percent * 99).toFixed(0) + '%')
      .replace(':msg', msg.substring(0, stream.columns - 27));

    stream.write('\x1b[1G' + str);
    stream.clearLine(1);

    if (percent === 1) {
      stream.clearLine();
      stream.cursorTo(0);
    }
  });
}
