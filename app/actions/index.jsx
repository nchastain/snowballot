import moment from 'moment'
import firebase from 'firebase'
import {firebaseRef, githubProvider} from 'app/firebase/constants.js'

export var addSb = (sb) => {
  return {
    type: 'ADD_SB',
    sb
  }
}

export var startAddSb = (title, choices) => {
  return (dispatch, getState) => {
    var sb = {
      title,
      choices,
      createdAt: moment().unix()
    }
    var uid = firebase.auth().currentUser.uid
    var sbRef = firebaseRef.child(`users/${uid}/sbs`).push(sb)

    return sbRef.then(() => {
      dispatch(addSb({
        ...sb,
        id: sbRef.key
      }))
    })
  }
}

export var startAddSbs = () => {
  return (dispatch, getState) => {
    var uid = getState().auth.uid
    var sbsRef = firebaseRef.child(`users/${uid}/sbs`)

    return sbsRef.once('value').then((snapshot) => {
      var sbs = snapshot.val() || {}
      var parsedSbs = []

      Object.keys(sbs).forEach((sbId) => {
        parsedSbs.push({
          id: sbId,
          ...sbs[sbId]
        })
      })

      dispatch(addSbs(parsedSbs))
    })
  }
}

export var addSbs = (sbs) => {
  return {
    type: 'ADD_SBS',
    sbs
  }
}

export var login = (uid) => {
  return {
    type: 'LOGIN',
    uid
  }
}

export var startLogin = () => {
  return (dispatch, getState) => {
    firebase.auth().signInWithPopup(githubProvider).then((result) => {
      console.log('Auth worked!', result)
    }, (error) => {
      console.log('Unable to auth', error)
    })
  }
}

export var logout = () => {
  return {
    type: 'LOGOUT'
  }
}

export var startLogout = () => {
  return (dispatch, getState) => {
    return firebase.auth().signOut().then(() => {
      console.log('Logged out!')
    })
  }
}
