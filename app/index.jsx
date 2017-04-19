import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from 'App'
import firebase from 'firebase'
import * as actions from 'actions'
import configure from './store/configureStore.jsx'
import { BrowserRouter } from 'react-router-dom'

let store = configure()

let initialized = false

if (!initialized) {
  store.dispatch(actions.startAddSbs())
  initialized = true
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.startAddPrivateSbs())
    store.dispatch(actions.startAddVotes(user.uid))
    store.dispatch(actions.login(user.uid))
  } else {
    store.dispatch(actions.logout())
  }
})

// Load foundation
$(document).foundation();

if (module.hot) {
  module.hot.accept();
}

// App css
require('style!css!sass!applicationStyles')
require('font-awesome-webpack')

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
