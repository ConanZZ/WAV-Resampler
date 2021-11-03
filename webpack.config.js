const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, './example/src/index.html'),
  filename: './index.html',
});

module.exports = function (env, argv) {
  return {
    entry: path.resolve(__dirname, './example/src/index.tsx'),
    output: {
      path: path.resolve(__dirname, '/example/dist'),
      filename: 'bundle.js',
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(jsx|js|ts|tsx)$/,
          include: [path.resolve(__dirname, '/src/')],
          use: 'eslint-loader',
          enforce: 'pre',
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    },
    plugins: [htmlWebpackPlugin],
    devServer: {
      port: 3004,
    },
  };
};
