const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: './src/debug/index.ts',
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['public/build']
    }),
    new HtmlWebpackPlugin({
      template: 'src/debug/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/debug/**/*.css",
          to:Path.resolve(__dirname, 'out', '[name][ext]'),
          force: true,
        }
      ]
    }),
  ],
  output: {
    path: Path.resolve(__dirname, 'out'),
    filename: 'build/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader' }
    ]
  },
  devServer: {
    open: true
  }
}