'use strict';

import glob from 'glob';
import path from 'path';

function formatName (name) {
  return name.replace(/^\.\//g, '');
}

export default (files, entry, args) => {
  let newEntry = entry || {};

  if (typeof newEntry === 'string' || Array.isArray(newEntry)) {
    newEntry = { main: newEntry };
  }

  if (Array.isArray(files)) {
    files.forEach(output => {
      [...glob.sync(output, {
        cwd: args.cwd,
        nodir: true
      })].forEach(item => {
        let key = null;
        let ext = path.extname(item);
        if (ext === '.css' || ext === '.less') {
          key = item.replace(/\.(css|less)$/, '.css');
        } else {
          key = item.replace(new RegExp(ext + '$'), '');
        }
        newEntry[formatName(key)] = item;
      });
    });
  }
  return newEntry;
};
