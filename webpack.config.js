const path = require('path');

const DIST_DIR = path.resolve(__dirname, 'src/dist');
const APP_DIR = path.resolve(__dirname, 'src/app');
const BASE_DIR = path.resolve(__dirname, 'src');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(BASE_DIR, '/index.html'),
  filename: 'index.html',
  inject: 'body'
});
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var BrowserSyncPluginConfig = new BrowserSyncPlugin({
  proxy: 'localhost:8000'
});
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ExtractTextPluginConfig = new ExtractTextPlugin('static/styles/[name].css');

module.exports = {
  devtool: 'eval',
  entry: ['webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.join(APP_DIR, '/index.js')],
  output: {
    filename: 'static/js/bundle.js',
    path: DIST_DIR
  },
  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2016']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader'})
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  plugins: [HtmlWebpackPluginConfig, BrowserSyncPluginConfig, ExtractTextPluginConfig]
};
