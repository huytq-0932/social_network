//const withProgressBar = require('next-progressbar')
//const WebpackBar = require('webpackbar');
//const env = require('dotenv').config().parsed;
//const withCSS = require('@zeit/next-css')
//const withSourceMaps = require('@zeit/next-source-maps');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');

const publicRuntimeConfig = require('./config/publicRuntime')
//const serverRuntimeConfig = require('./config/serverRuntime')
const inDevelopment = process.env.NODE_ENV === "development"


const NextAppConfig = {
  progressBar: {
    profile: false,
  },
  useFileSystemPublicRoutes: true,
  target: 'server',
  pageExtensions: ['tsx'],
  webpack: (config, options) => {
    /* if (options.dev) {
      config.devtool = 'cheap-module-source-map';
    }
    
    for (const plugin of config.plugins) {
      if (plugin.constructor.name === 'AutoDLLPlugin') {
        plugin._originalSettings.entry.dll = [
          ...plugin._originalSettings.entry.dll,
          'lodash',
          'moment',
          //'axios',
          //'core-js',
          'antd',
          '@ant-design/icons'
        ]
      }
    } */
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': `${__dirname}/src`,
      '@config': `${__dirname}/config`,
    }
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    });
    if (options.isServer) {

    }
    //config.plugins.push(new WebpackBar());
    return config;
  },
  webpackDevMiddleware: (config, options) => {
    config.watchOptions.ignored = [
      ...config.watchOptions.ignored,
      /\.git\//,
      /\.next\//,
      /node_modules/,
      /[\\\/]app[\\\/]/,
      /[\\\/]dist[\\\/]/,
      /[\\\/]libs[\\\/]/,
      /[\\\/]logs[\\\/]/,
      /[\\\/]public[\\\/]/,
      /[\\\/]static[\\\/]/,
      /[\\\/]routes[\\\/]/,
      /[\\\/]databases[\\\/]/,
      /[\\\/]docs[\\\/]/,
      /next\.config\.js/
    ]
    return config
  },
  //env: env,
  onDemandEntries: {
    maxInactiveAge: 60000000,
    pagesBufferLength: 99999
  },
  compress: !inDevelopment,
  publicRuntimeConfig: publicRuntimeConfig,
  //serverRuntimeConfig: serverRuntimeConfig
};

module.exports = withPlugins([
//  [withSourceMaps],
  [withLess, {
    // cssModules: true,
    lessLoaderOptions: {
      javascriptEnabled: true
    }
  }],
//  [withCSS],
  //[withProgressBar],
], NextAppConfig);

//module.exports =  NextAppConfig
