'use strict';

const join = require('path').join;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const merge = require('./merge');
const mixEntry = require('./mixEntry');
const CssEntryPlugin = require('./CssEntryPlugin');

try {
  require('babel-core-resolve-enhance')({
    dirname: __dirname,
  });
} catch (e) {
  console.error(`[Error] ${e.message}`);
}

function base(args) {
  const pkg = require(join(args.cwd, 'package.json'));

  const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';
  const babelQuery = {
    presets: ['es2015', 'react', 'stage-0']
  };

  return {
    output: {
      path: join(process.cwd(), './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName,
    },
    devtool: args.devtool,
    resolve: {
      modulesDirectories: ['node_modules', join(__dirname, '../node_modules')],
      extensions: ['', '.js', '.jsx'],
    },
    resolveLoader: {
      modulesDirectories: ['node_modules', join(__dirname, '../node_modules')],
    },
    entry: mixEntry(pkg.files, pkg.entry, args),
    externals: pkg.externals,
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelQuery,
      }, {
        test: /\.jsx$/,
        loader: 'babel',
        query: babelQuery,
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap&-restructuring!autoprefixer'
        ),
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap!autoprefixer!less?sourceMap'
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
    plugins: [
      new ExtractTextPlugin(cssFileName, {
        disable: false,
        allChunks: true,
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new CssEntryPlugin()
    ],
  };
}

function npm3Hack(cfg) {
  var doolPath = join(__dirname, '../..');
  if (~doolPath.indexOf('dool')) {
    args.resolveLoader.modulesDirectories.push(doolPath);
  }
  return cfg;
}
module.exports = function getConfig(args) {
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
        output: {
          ascii_only: true,
        },
        compress: {
          warnings: false,
        },
      }),
    ];
  }

  cfg.plugins = [
    ...cfg.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new webpack.optimize.DedupePlugin(),
  ];

  // Output map.json if hash.
  if (args.hash) {
    const pkg = require(join(args.cwd, 'package.json'));
    cfg.output.filename = cfg.output.chunkFilename = '[name]-[chunkhash].js';
    cfg.plugins = [
      ...cfg.plugins,
      require('map-json-webpack-plugin')({
        assetsPath: pkg.name,
        output: join(cfg.output.path, 'map.json'),
      }),
    ];
  }

  cfg = merge(cfg, join(args.cwd, args.config || 'webpack.config.js'));

  return cfg;
}