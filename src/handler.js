'use strict';

import Gauge from "gauge";

const gauge = new Gauge();

export default function(percentage, msg) {
  if (percentage < 0.9) {
    gauge.show(msg, percentage);
  } else {
    gauge.hide();
  }
}