import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from 'App'
import firebase from 'firebase'
import * as actions from 'actions'
import { configure } from './store/configureStore.jsx'

let store = configure()

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		store.dispatch(actions.login(user.uid))
		store.dispatch(actions.startAddSbs())
	} else {
		store.dispatch(actions.logout())
	}
})

//Load foundation
$(document).foundation();

if (module.hot) {
  module.hot.accept();
}

// App css
require('style!css!sass!applicationStyles')

ReactDOM.render(
  <Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);
