const path = require('path');

module.exports = function (env, argv) {
  return {
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
      path: path.resolve(__dirname, 'dist/assets'),
    },
    module: {
      rule: [
        {
          test: /\.(jsx|js|ts|tsx)$/,
          include: ['src'],
          use: ['eslint-loader'],
          enforce: 'pre',
        },
      ],
    },
  };
};
