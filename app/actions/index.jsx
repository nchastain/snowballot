import moment from 'moment'
import firebase from 'firebase'
import {firebaseRef, githubProvider} from 'app/firebase/constants.js'

export var addSb = (sb) => {
  return {
    type: 'ADD_SB',
    sb
  }
}

export var startAddSb = (title, choice1, choice2) => {
  return (dispatch, getState) => {
    var sb = {
      title,
      choices: [{
        title: choice1,
        votes: 0
      },
      {
        title: choice2,
        votes: 0
      }],
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
