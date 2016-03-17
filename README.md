dool-build
===

> d-band tool & dev tool based on webpack, changed from [atool](https://github.com/ant-tool)


[![NPM version](https://img.shields.io/npm/v/dool-build.svg)](https://www.npmjs.com/package/dool-build)
[![NPM downloads](https://img.shields.io/npm/dm/dool-build.svg)](https://www.npmjs.com/package/dool-build)
[![Build Status](https://travis-ci.org/d-band/dool-build.svg)](https://travis-ci.org/d-band/dool-build)
[![Coverage Status](https://coveralls.io/repos/github/d-band/dool-build/badge.svg?branch=master)](https://coveralls.io/github/d-band/dool-build?branch=master)
[![Dependency Status](https://david-dm.org/d-band/dool-build.svg)](https://david-dm.org/d-band/dool-build)

## Install

```bash
$ npm install dool -g
```

## Usage

- Examples: https://github.com/d-band/dool-examples


```
$ dool build -h

  Usage: dool-build [options]

  Options:

    -h, --help                output usage information
    -v, --version             output the version number
    -o, --output-path <path>  output path
    -w, --watch [delay]       watch file changes and rebuild
    --hash                    build with hash and output map.json
    --devtool <devtool>       sourcemap generate method, default is null
    --config <path>           custom config path, default is webpack.config.js
    --no-compress             build without compress
```

[![asciicast](https://asciinema.org/a/34125.png)](https://asciinema.org/a/34125)

## Report a issue

* [All issues](https://github.com/d-band/dool-build/issues)
* [New issue](https://github.com/d-band/dool-build/issues/new)

## License

dool-build is available under the terms of the MIT License.