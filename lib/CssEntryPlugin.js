'use strict';

function CssEntryPlugin(options) {}

CssEntryPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    for (let f in compilation.assets) {
      if (/\.(css|less)\.js$/i.test(f)) {
        delete compilation.assets[f];
      }

      let r = /\.(css|less)\.css$/i;
      if (r.test(f)) {
        let temp = compilation.assets[f];
        let name = f.replace(r, '.css');

        compilation.assets[name] = temp;
        delete compilation.assets[f];
      }
    }
    callback();
  });
};

module.exports = CssEntryPlugin;