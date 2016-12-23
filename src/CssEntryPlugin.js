'use strict';

function CssEntryPlugin(options) {}

CssEntryPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    compilation.chunks.filter(chunk => {
      return /\.css$/i.test(chunk.name);
    }).forEach(chunk => {
      const oldName = chunk.name;
      const newName = oldName.replace(/\.css$/i, '');

      chunk.name = newName;
      chunk.files = chunk.files.filter(file => {
        const isCss = /\.css(|\.map)$/i.test(file);
        if (!isCss) {
          delete compilation.assets[file];
        }
        return isCss;
      }).map(oldFile => {
        // do not handle map file
        if (/\.map$/i.test(oldFile)) return oldFile;

        const newFile = oldFile.replace(oldName, newName);
        // change css assets name
        const tmp = compilation.assets[oldFile];
        compilation.assets[newFile] = tmp;
        delete compilation.assets[oldFile];
        return newFile;
      });
    });
    callback();
  });
};

export default CssEntryPlugin;