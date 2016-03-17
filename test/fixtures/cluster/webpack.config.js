module.exports = function(cfg) {
  return [{
    a: './a.js'
  }, {
    b: './b.js'
  }].map(function(v) {
    return Object.assign({}, cfg, {
      entry: v
    });
  })
};