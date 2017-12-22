const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    pxtorem = require('postcss-pxtorem');

module.exports = {
    devtool: 'eval-source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        bundle: [
            './client/app',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
        ],
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
        filename: '[name].js',
        chunkFilename: 'js/chunk.[name].js',
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0', 'react-hmre'],
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
        },  {
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
            loader: 'html?minimize=false'
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
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: 'js/[name].js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
        new HtmlWebpackPlugin({
            filename: '../views/dev/index.html',
            template: './views/tpl/index.tpl.html'
        }),
        new ExtractTextPlugin("css/[name].css"),
        new ProgressBarPlugin({summary: false})
    ]
}
