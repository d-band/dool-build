'use strict';

const stat = require('fs').statSync;
const glob = require('glob');
const path = require('path');

function formatName(name) {
  return name.replace(/^\.\//g, '');
}

module.exports = function(files, entry, args) {
  let newEntry = entry || {};

  if (typeof newEntry === 'string' || Array.isArray(newEntry)) {
    newEntry = {
      main: newEntry
    };
  }

  if (Array.isArray(files)) {
    files.forEach(function(output) {
      [...glob.sync(output, {
        cwd: args.cwd
      })].forEach(function(item) {
        let f = path.join(args.cwd, item);
        if (stat(f).isFile()) {
          let key = null;
          let ext = path.extname(item);
          if (ext === '.css' || ext === '.less') {
            key = item.replace(/\.(css|less)$/, '.css');
          } else {
            key = item.replace(new RegExp(ext + '$'), '');
          }
          newEntry[formatName(key)] = item;
        }
      });
    });
  }
  return newEntry;
};