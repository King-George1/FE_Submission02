const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: "development",
  entry: {
    orders: './src/js/orders.js',
    dashboard: './src/js/dashboard.js',
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'dashboard.html',
      template: 'src/dashboard.html',
      chunks: ['dashboard']
    }),
    new HtmlWebpackPlugin({
      filename: 'orders.html',
      template: 'src/orders.html',
      chunks: ['orders']
    })
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public/index.html"),
    },
    port: 9000,
    open: true,
  }
};

module.exports = config;