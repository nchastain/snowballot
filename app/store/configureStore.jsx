import * as redux from 'redux'
import thunk from 'redux-thunk'
import {
  sbsReducer,
  userReducer,
  sbReducer
  } from '.././reducers/reducers.jsx'

const configure = function (initialState = {}) {
  var reducer = redux.combineReducers({
    sbs: sbsReducer,
    user: userReducer,
    sb: sbReducer
  })

  var rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
      state = undefined
    }

    return reducer(state, action)
  }

  var store
  if (typeof window !== 'undefined') {
    store = redux.createStore(rootReducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ))
  } else {
    store = redux.createStore(rootReducer, initialState)
  }

  if (module.hot) {
    module.hot.accept('.././reducers/reducers', () => {
      const nextRootReducer = require('.././reducers/reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configure
