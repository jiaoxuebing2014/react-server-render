// Provide custom regenerator runtime and core-js
require('babel-polyfill')

// Node babel source map support
require('source-map-support').install()

// Javascript require hook
require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: [
        'transform-runtime',
        'transform-decorators-legacy',
        'transform-class-properties',
        'add-module-exports'
    ]
})

// Css require hook
require('css-modules-require-hook')({
    extensions: ['.scss'],
    preprocessCss: (data, filename) =>
        require('node-sass').renderSync({
            data,
            file: filename
        }).css,
    camelCase: true,
    generateScopedName: '[name]__[local]__[hash:base64:8]'
})

// Image require hook
require('asset-require-hook')({
    name: '/[hash].[ext]',
    extensions: ['jpg', 'png', 'gif', 'webp'],
    limit: 8000
})

const app = require('./app.js'),
    convert = require('koa-convert'),
    webpack = require('webpack'),
    fs = require('fs'),
    path = require('path'),
    devMiddleware = require('koa-webpack-dev-middleware'),
    hotMiddleware = require('koa-webpack-hot-middleware'),
    views = require('koa-views'),
    router = require('./routes'),
    clientRoute = require('./middlewares/clientRoute'),
    config = require('../build/webpack.dev.config'),
    port = process.env.port || 3000,
    compiler = webpack(config)

// Webpack hook event to write html file into `/views/dev` from `/views/tpl` due to server render
compiler.plugin('emit', (compilation, callback) => {
    const assets = compilation.assets
    let file, data

    Object.keys(assets).forEach(key => {
        if (key.match(/\.html$/)) {
            file = path.resolve(__dirname, key)
            data = assets[key].source()
            fs.writeFileSync(file, data)
        }
    })
    callback()
})

app.use(views(path.resolve(__dirname, '../views/dev'), {map: {html: 'ejs'}}))
app.use(clientRoute)
app.use(router.routes())
app.use(router.allowedMethods())
console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)
app.use(convert(devMiddleware(compiler, {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    //lazy: true,

    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    publicPath: config.output.publicPath,

    // custom headers
    headers: { "X-Custom-Header": "yes" },

    // options for formating the statistics
    stats: {
        colors: true
    }
})))
app.use(convert(hotMiddleware(compiler)))
app.listen(port)
