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
        postLoaders: [
            {
                loader: "transform?brfs"
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
