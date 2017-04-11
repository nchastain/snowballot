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
var App = require('./app/components/App.jsx').default
var configureStore = require('./app/store/configureStore.jsx').default

// Create our app
var app = express()
const PORT = process.env.PORT || 3003

app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url)
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

app.use(express.static('public'))

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

// app.use(handleRender)

// function handleRender (req, res) {
//   var store = configureStore()

//   // Render the component to a string
//   var html = (0, ReactDOMServer.renderToString)(React.createElement(
//     ReactRedux.Provider,
//     { store: store },
//     React.createElement(App, null)
//   ))

//   // Grab the initial state from our Redux store
//   var preloadedState = store.getState()

//   // Send the rendered page back to the client
//   res.send(renderFullPage(html, preloadedState))
// }

// function renderFullPage (html, preloadedState) {
//   return `
//     <!doctype html>
//     <html>
//       <head>
//         <title>Redux Universal Example</title>
//       </head>
//       <body>
//         <div id='root'>${html}</div>
//         <script>
//           // WARNING: See the following for security issues around embedding JSON in HTML:
//           // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
//           __PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
//         </script>
//         <script src='/public/bundle.js'></script>
//       </body>
//     </html>
//     `
// }

app.listen(PORT, function () {
  console.log('Express server is up on port ' + PORT)
})
