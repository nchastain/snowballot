require('babel-register')({
  presets: ['es2015', 'react', 'stage-0']
})

var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config.js')
var compiler = webpack(config)
var React = require('react')
var Redux = require('redux')
var ReactDOMServer = require('react-dom/server')
var ReactRedux = require('react-redux')
var ReactRouter = require('react-router')
var configureStore = require('./app/store/configureStore.jsx').default

// Create our app
var app = express()
const PORT = process.env.PORT || 3003

app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect(`http://${req.hostname}${req.url}`)
  } else {
    next()
  }
})

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))

app.use(express.static('dist'))

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

app.listen(PORT, function () {
  console.log(`Express server is up on port ${PORT}`)
})
