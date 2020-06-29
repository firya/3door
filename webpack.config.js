const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var entries = [
  {
    entry: './src/js/scripts.js',
    dist: ''
  }
];

function webpackRules(dist) {
  return [
    {
      test: /\.(js|jsx)?$/,
      exclude: [/(node_modules|bower_components)/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env'],
            ["@babel/preset-react"]
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties']
          ]
        }
      }
    },
    {
      test: /\.css$/,
      include: path.resolve(__dirname, "src"),
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {}
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            url: false
          }
        },
        {
          loader: "postcss-loader",
          options: {
            ident: "postcss",
            sourceMap: true,
            plugins: () => [
              postcssImport(),
              postcssPresetEnv({
                browsers: 'last 2 versions',
                features: {
                  'nesting-rules': true
                },
                stage: 0
              }),
              require("cssnano")({
                preset: [
                  "default",
                  {
                    discardComments: {
                      removeAll: true
                    }
                  }
                ]
              })
            ]
          }
        }
      ]
    }
  ];
}

var webpackPlugins = [
  new MiniCssExtractPlugin({
    filename: "css/style.css",
  }),
  new BrowserSyncPlugin({
    proxy: "3door.maksimlebedev.local",
    open: false
  }),
  new Dotenv()
];

var webpackWatchOptions = {
  ignored: ['node_modules', 'public/node_modules']
}



module.exports = (env) => {
  var result = [];

  entries.map((item, i) => {
    var entry = {};
    entry[item.dist] = item.entry;

    var filename = (item.filename) ? item.filename : 'scripts';

    result.push({
      entry: entry,
      output: {
        path: path.resolve(__dirname, `public/`),
        filename: `js/${filename}.js`,
      },
      module: {
        rules: webpackRules(item.dist)
      },
      plugins: webpackPlugins,
      watchOptions: webpackWatchOptions
    });
  });

  return result;
}