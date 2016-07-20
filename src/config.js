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
    babel: babelrc,
    context: args.cwd,
    output: {
      path: join(args.cwd, './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName,
    },
    devtool: args.devtool,
    resolve: {
      modules: ['node_modules', join(__dirname, '../node_modules')],
      extensions: ['', '.js', '.jsx'],
    },
    resolveLoader: {
      modules: ['node_modules', join(__dirname, '../node_modules')],
    },
    entry: mixEntry(pkg.files, pkg.entry, args),
    externals: pkg.externals,
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }, {
        test: /\.jsx$/,
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap&-restructuring!postcss'
        ),
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap!postcss!less?sourceMap'
        ),
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/svg+xml'
      }, {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url?limit=10000'
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.atpl$/,
        loader: 'atpl'
      }]
    },
    postcss: [require('autoprefixer')({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8']
    })],
    plugins: [
      new ExtractTextPlugin({
        filename: cssFileName,
        disable: false,
        allChunks: true,
      }),
      new CssEntryPlugin()
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
    cfg.plugins = [...cfg.plugins,
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: args.devtool && /source(map|-map)/.test(args.devtool)
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    ];
  }

  cfg.plugins = [
    ...cfg.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new webpack.optimize.DedupePlugin()
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
