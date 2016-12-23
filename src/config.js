'use strict';

import { join } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import babelrc from './babelrc';
import merge from './merge';
import mixEntry from './mixEntry';
import CssEntryPlugin from './CssEntryPlugin';

function base(args) {
  const pkg = require(join(args.cwd, 'package.json'));

  const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';

  return {
    context: args.cwd,
    output: {
      path: join(args.cwd, './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName,
    },
    devtool: args.devtool,
    resolve: {
      modules: ['node_modules', join(__dirname, '../node_modules')],
      extensions: ['*', '.js', '.jsx'],
    },
    resolveLoader: {
      modules: ['node_modules', join(__dirname, '../node_modules')],
    },
    entry: mixEntry(pkg.files, pkg.entry, args),
    externals: pkg.externals,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.jsx$/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap!postcss-loader'
        )
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap!postcss-loader!less-loader?sourceMap'
        )
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml'
      }, {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.atpl$/,
        loader: 'atpl-loader'
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: cssFileName,
        disable: false,
        allChunks: true,
      }),
      new CssEntryPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: args.cwd,
          babel: babelrc,
          postcss: [require('autoprefixer')({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
          })]
        }
      })
    ]
  };
}

function npm3Hack(cfg) {
  var doolPath = join(__dirname, '../..');
  if (~doolPath.indexOf('dool')) {
    cfg.resolveLoader.modules.push(doolPath);
  }
  return cfg;
}

export default function getConfig(args) {
  let cfg = base(args);

  cfg = npm3Hack(cfg);

  cfg.plugins = cfg.plugins || [];

  // Config outputPath.
  if (args.outputPath) {
    cfg.output.path = args.outputPath;
  }

  // Config if no --no-compress.
  if (args.compress) {
    cfg.plugins = [
      ...cfg.plugins,
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: args.devtool && /source(map|-map)/.test(args.devtool)
      }),
      new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
      })
    ];
  }

  cfg.plugins = [
    ...cfg.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    })
  ];

  // Output map.json if hash.
  if (args.hash) {
    cfg.output.filename = cfg.output.chunkFilename = '[name]-[chunkhash].js';
    cfg.plugins = [
      ...cfg.plugins,
      require('map-json-webpack-plugin')(),
    ];
  }

  cfg = merge(cfg, join(args.cwd, args.config || 'webpack.config.js'), webpack);

  return Array.isArray(cfg) ? cfg : [cfg];
}
