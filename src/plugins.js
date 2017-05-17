'use strict';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CssEntryPlugin from './CssEntryPlugin';

export default (args) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    })
  ];
  if (args.extract) {
    plugins.push(new CssEntryPlugin());
    const cssFile = (getPath) => {
      const name = getPath('[name]').replace(/\.css$/, '');
      if (args.hash) {
        return `${name}-${getPath('[chunkhash]')}.css`;
      } else {
        return `${name}.css`;
      }
    };
    plugins.push(new ExtractTextPlugin({
      filename: cssFile,
      disable: false,
      allChunks: true
    }));
  }
  if (args.compress) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: args.devtool && /source(map|-map)/.test(args.devtool)
    }));
  }
  return plugins;
};
