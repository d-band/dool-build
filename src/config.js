'use strict';

import { join } from 'path';
import webpack from 'webpack';

import loaders from './loaders';
import plugins from './plugins';
import merge from './merge';
import mixEntry from './mixEntry';

function base (args) {
  const pkg = require(join(args.cwd, 'package.json'));
  const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
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
      rules: loaders(args)
    },
    plugins: plugins(args),
    performance: {
      hints: args.compress ? 'warning' : false,
      maxAssetSize: 400000,
      maxEntrypointSize: 400000
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

  // Config outputPath & publicPath.
  if (args.outputPath) {
    cfg.output.path = args.outputPath;
  }
  if (args.publicPath) {
    cfg.output.publicPath = args.publicPath;
  }

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
      if (rule.key) delete rule.key;
    });
    // More options
    const options = {
      context: args.cwd
    };
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
