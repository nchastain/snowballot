import * as redux from 'redux'
import thunk from 'redux-thunk'
import { sbsReducer, authReducer } from 'reducers'

export const configure = function (initialState = {}) {
  var reducer = redux.combineReducers({
    sbsReducer,
    authReducer
  })

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))

  return store
}
