'use strict';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import babelrc from './babelrc';

export default (args) => {
  const css = {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      minimize: args.compress
    }
  };
  const postcss = {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: (loader) => [
        require('autoprefixer')({
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
        })
      ]
    }
  };
  const less = {
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  };
  const babel = {
    loader: 'babel-loader',
    options: babelrc()
  };
  return [{
    key: 'js',
    test: /\.js$/,
    exclude: /node_modules/,
    loader: babel
  }, {
    key: 'jsx',
    test: /\.jsx$/,
    loader: babel
  }, {
    key: 'css',
    test: /\.css$/,
    loader: args.extract ? ExtractTextPlugin.extract({
      use: [css, postcss]
    }) : [css, postcss]
  }, {
    key: 'less',
    test: /\.less$/,
    loader: args.extract ? ExtractTextPlugin.extract({
      use: [css, postcss, less]
    }) : [css, postcss, less]
  }, {
    key: 'font',
    test: /\.(otf|ttf|woff2?|eot)(\?\S*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }, {
    key: 'svg',
    test: /\.svg(\?\S*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }, {
    key: 'image',
    test: /\.(gif|png|jpe?g)(\?\S*)?$/i,
    loader: 'url-loader',
    options: {
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
};
