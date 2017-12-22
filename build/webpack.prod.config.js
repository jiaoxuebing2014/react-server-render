const path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    cssnano = require('cssnano'),
    pxtorem = require('postcss-pxtorem');
let clientConfig, serverConfig;

function getExternals() {
    return fs.readdirSync(path.resolve(__dirname, '../node_modules'))
        .filter(filename => !filename.includes('.bin'))
        .reduce((externals, filename) => {
            externals[filename] = `commonjs ${filename}`

            return externals
        }, {})
}

clientConfig = {
    context: path.resolve(__dirname, '..'),
    entry: {
        bundle: './client/app',
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'mobx',
            'mobx-react',
            'axios'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist/client'),
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/chunk.[name].[chunkhash:8].js',
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    'transform-runtime',
                    'transform-decorators-legacy',
                    'transform-class-properties',
                    'add-module-exports',
                    ["import", { libraryName: "antd-mobile", style: "css" }]
                ],
                cacheDirectory: true
            }
        }, {
            test: /\.scss/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css!postcss')
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            loader: [
                'url?limit=8192&name=images/[hash:8].[name].[ext]',
                'image-webpack-loader?bypassOnDebug&optimizationLevel=6&interlaced=false'
            ]
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.html$/,
            loader: 'html?minimize=true'
        }]
    },
    resolve: {extensions: ['', '.js','.jsx', '.json']},
    postcss: function () {
        return [
            autoprefixer({
                browsers: ['last 3 versions', '> 1%']
            }),
            pxtorem({
                rootValue: 100,
                propWhiteList: [],
            }),
            cssnano({
                reduceIdents: false,
                safe: true
            })
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: 'js/[name].[chunkhash:8].js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            comments: false
        }),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
        new HtmlWebpackPlugin({
            filename: '../../views/prod/index.html',
            template: './views/tpl/index.tpl.html',
            chunksSortMode: 'none'
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css', {allChunks: true})
    ]
};

serverConfig = {
    context: path.resolve(__dirname, '..'),
    entry: {server: './server/server.prod'},
    output: {
        path: path.resolve(__dirname, '../dist/server'),
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js'
    },
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    'transform-runtime',
                    'transform-decorators-legacy',
                    'transform-class-properties',
                    'add-module-exports'
                ],
                cacheDirectory: true
            }
        }, {
            test: /\.scss$/,
            loaders: [
                'css/locals?modules&camelCase&importLoaders=1&localIdentName=[hash:base64:8]',
                'sass'
            ]
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            loader: 'url?limit=8000'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    externals: getExternals(),
    resolve: {extensions: ['', '.js','.jsx', '.json']},
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            comments: false
        }),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})
    ]
}

module.exports = [clientConfig, serverConfig]
