'use strict';

export default () => {
  return {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('babel-preset-env'), {
        modules: false
      }],
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0')
    ],
    plugins: []
  };
};
