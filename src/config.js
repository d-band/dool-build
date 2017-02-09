'use strict';

import { join } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import babelrc from './babelrc';
import loaders from './loaders';
import merge from './merge';
import mixEntry from './mixEntry';
import CssEntryPlugin from './CssEntryPlugin';

function base (args) {
  const pkg = require(join(args.cwd, 'package.json'));

  const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';

  return {
    context: args.cwd,
    output: {
      path: join(args.cwd, './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName
    },
    devtool: args.devtool,
    resolve: {
      modules: ['node_modules', join(__dirname, '../node_modules')],
      extensions: ['*', '.js', '.jsx']
    },
    resolveLoader: {
      modules: ['node_modules', join(__dirname, '../node_modules')]
    },
    entry: mixEntry(pkg.files, pkg.entry, args),
    externals: pkg.externals,
    module: {
      rules: loaders()
    },
    plugins: [
      new ExtractTextPlugin({
        filename: cssFileName,
        disable: false,
        allChunks: true
      }),
      new CssEntryPlugin()
    ],
    performance: {
      hints: args.compress ? 'warning' : false,
      maxAssetSize: 400000,
      maxEntrypointSize: 400000
    },
    // More options
    babel: babelrc(),
    postcss: {
      plugins: [
        require('autoprefixer')({
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
        })
      ]
    }
  };
}

function npm3Hack (cfg) {
  var doolPath = join(__dirname, '../..');
  if (~doolPath.indexOf('dool')) {
    cfg.resolveLoader.modules.push(doolPath);
  }
  return cfg;
}

export default function getConfig (args) {
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
      require('map-json-webpack-plugin')()
    ];
  }

  cfg = merge(cfg, join(args.cwd, args.config || 'webpack.config.js'), webpack);

  const cfgs = Array.isArray(cfg) ? cfg : [cfg];
  cfgs.forEach(cfg => {
    cfg.module.rules.forEach(rule => {
      if (rule.key) {
        delete rule.key;
      }
    });
    // More options
    const options = {
      context: args.cwd
    };
    if (cfg.babel) {
      options.babel = cfg.babel;
      delete cfg.babel;
    }
    if (cfg.postcss) {
      options.postcss = cfg.postcss;
      delete cfg.postcss;
    }
    cfg.plugins = [
      ...cfg.plugins,
      new webpack.LoaderOptionsPlugin({
        debug: !args.compress,
        minimize: args.compress,
        options: options
      })
    ];
  });

  return cfgs;
}
