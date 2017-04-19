import * as redux from 'redux'
import thunk from 'redux-thunk'
import { sbsReducer, authReducer, privateSbsReducer } from '.././reducers/reducers.jsx'

const configure = function (initialState = {}) {
  var reducer = redux.combineReducers({
    sbs: sbsReducer,
    auth: authReducer,
    privateSbs: privateSbsReducer
  })

  if (typeof window !== 'undefined') {
    var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ))
  } else {
    var store = redux.createStore(reducer, initialState)
  }

  return store
}

export default configure