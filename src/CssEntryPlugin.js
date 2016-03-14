'use strict';

function CssEntryPlugin(options) {}

CssEntryPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    for (let f in compilation.assets) {
      if (/\.(css|less)(|-[a-z0-9]{20})\.js(|\.map)$/i.test(f)) {
        delete compilation.assets[f];
      }

      let r = /\.(css|less)(|-[a-z0-9]{20})\.css$/i;
      if (r.test(f)) {
        let temp = compilation.assets[f];
        let name = f.replace(r, '$2.css');

        compilation.assets[name] = temp;
        delete compilation.assets[f];
      }
    }
    callback();
  });
};

export default CssEntryPlugin;