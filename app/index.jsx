import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App'
import firebase from 'firebase'

//Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles')

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
