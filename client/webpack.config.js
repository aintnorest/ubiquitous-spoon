var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['', '.jsx', '.js'],
    },
    entry: [
        './index.js'
    ],
    plugins : [
        new webpack.DefinePlugin({
            'NODE_ENV' : JSON.stringify((process.env.NODE_ENV || 'development').trim())
      }),
    ],
    output: {
        path: path.join(__dirname, '../server/static'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        postLoaders: [
            {
                loader: "transform?brfs"
            },
            {
                include: path.resolve(__dirname, 'node_modules/pixi.js'),
                loader: 'transform?brfs'
            }
        ],
        loaders: [
            {
                test: /\.png$/,
                loader: "url-loader",
                query: { mimetype: "image/png" }
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};
