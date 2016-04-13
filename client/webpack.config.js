var path = require('path');

module.exports = {
    resolve: {
       extensions: ['', '.jsx', '.js']
    },
    entry: [
       './index.js'
    ],
    output: {
       path: path.join(__dirname, '../server/static'),
       filename: 'bundle.js',
       publicPath: '/'
    },
    module: {
       loaders: [
         {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
         },
         {
          test: /\.json$/,
          loader: 'json-loader'
         }]
    }
};
