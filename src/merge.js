'use strict';

import { existsSync } from 'fs';

/**
 * Merge custom config from `webpack.config.js`.
 * @param baseCfg {Object}
 * @param customCfg {String}
 */
export default function merge (baseCfg, customCfg) {
  if (!existsSync(customCfg)) {
    return baseCfg;
  }

  const customConfig = require(customCfg);

  if (typeof customConfig === 'function') {
    return customConfig(baseCfg, ...[...arguments].slice(2));
  }

  throw new Error(`Return of ${customCfg} must be a function.`);
}
