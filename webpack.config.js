const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const port = 3000;

module.exports = {
  mode: 'development',  
  entry: './application.js',
  output: {
	path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
	publicPath: '/dist'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase',
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
	contentBase: __dirname,
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: true,
	compress: true,
	writeToDisk: true
  },
  plugins: [
	new HtmlWebPackPlugin({
        template: __dirname + '/index.html',
        filename: 'index2.html',
        inject: 'body'
    })]
};