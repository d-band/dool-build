'use strict';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CssEntryPlugin from './CssEntryPlugin';

export default (args) => {
  const plugins = [
    new CssEntryPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    })
  ];
  if (args.extract) {
    const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';
    plugins.push(new ExtractTextPlugin({
      filename: cssFileName,
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
