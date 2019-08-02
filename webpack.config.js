const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = function(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  mode: 'production',
  entry: {
    main: ['./src/jtpl-loader.js']
  },
  output: {
    path: resolve('dist'),
    filename: 'index.js',
    library: 'jtpl-loader',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js']
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    rules:[
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}