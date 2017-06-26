const path = require('path');

module.exports = function(cfg) {
  cfg.recordsPath = path.join(__dirname, 'records.json');
  return cfg;
}