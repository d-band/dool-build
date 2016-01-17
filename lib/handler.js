'use strict';

const Gauge = require("gauge")
const gauge = new Gauge();

module.exports = function(percentage, msg) {
  if (percentage < 0.9) {
    gauge.show(msg, percentage);
  } else {
    gauge.hide();
  }
}