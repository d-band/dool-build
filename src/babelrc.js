'use strict';

export default () => {
  return {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('babel-preset-latest'), {
        'es2015': { 'modules': false }
      }],
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0')
    ],
    plugins: [
      require.resolve('babel-plugin-add-module-exports')
    ]
  };
};
