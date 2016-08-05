'use strict';

import { tmpdir } from 'os';

export default {
  cacheDirectory: tmpdir(),
  presets: [
    require.resolve('babel-preset-es2015-webpack'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0')
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports')
  ]
};