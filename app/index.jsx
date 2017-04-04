import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from 'App'
import firebase from 'firebase'
import { configure } from './store/configureStore.jsx'

//Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles')

ReactDOM.render(
  <Provider store={configure()}>
  	<App />
  </Provider>,
  document.getElementById('root')
);
