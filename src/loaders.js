'use strict';

import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default () => {
  return [{
    key: 'js',
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }, {
    key: 'jsx',
    test: /\.jsx$/,
    loader: 'babel-loader'
  }, {
    key: 'css',
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'css-loader?sourceMap!postcss-loader'
    )
  }, {
    key: 'less',
    test: /\.less$/,
    loader: ExtractTextPlugin.extract(
      'css-loader?sourceMap!postcss-loader!less-loader?sourceMap'
    )
  }, {
    key: 'font',
    test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
    loader: 'url-loader',
    query: {
      limit: 10000
    }
  }, {
    key: 'svg',
    test: /\.svg(\?\S*)?$/,
    loader: 'url-loader',
    query: {
      limit: 10000
    }
  }, {
    key: 'image',
    test: /\.(gif|png|jpe?g)(\?\S*)?$/i,
    loader: 'url-loader',
    query: {
      limit: 10000
    }
  }, {
    key: 'json',
    test: /\.json$/,
    loader: 'json-loader'
  }, {
    key: 'atpl',
    test: /\.atpl$/,
    loader: 'atpl-loader'
  }];
}
