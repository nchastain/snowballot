import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Main from './components/Main'
import firebase from 'firebase'
import * as actions from 'actions'
import configure from './store/configureStore.jsx'
import { BrowserRouter } from 'react-router-dom'

let store = configure()

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.login(user.uid, user.photoURL, user.displayName, user.email))
    store.dispatch(actions.getUserInfo())
  } else {
    store.dispatch(actions.logout())
  }
})

$(document).foundation()

if (module.hot) {
  module.hot.accept()
}

require('style!css!sass!applicationStyles')
require('font-awesome-webpack')

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
