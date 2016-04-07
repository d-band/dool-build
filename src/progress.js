'use strict';

import { green, cyan } from './color';
import { ProgressPlugin } from 'webpack';
import ProgressBar from "progress";

export default function() {
  const bar = new ProgressBar(`${green('[:bar]')} :percent ${cyan(':msg')}`, {
    complete: '=',
    incomplete: ' ',
    total: 20,
    clear: true
  });

  const maxLen = bar.stream.columns - 27;

  return new ProgressPlugin(function handler(percentage, msg) {
    bar.update(percentage, {
      msg: msg.substring(0, maxLen)
    });
    if (percentage === 1) {
      bar.terminate();
    }
  });
}