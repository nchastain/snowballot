import moment from 'moment'
import firebase from 'firebase'
import {firebaseRef, githubProvider, firebaseAuth} from '.././firebase/constants.js'

export var addSb = (sb) => {
  return {
    type: 'ADD_SB',
    sb
  }
}

export var startAddSb = (title, alias, choices) => {
  return (dispatch, getState) => {
    var sb = {
      title,
      alias,
      choices,
      createdAt: moment().unix(),
      creator: getState().auth.uid
    }
    var sbRef = firebaseRef.child(`publicSbs`).push(sb)

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
    var sbsRef = firebaseRef.child(`publicSbs`)

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

export var startUpdateSb = (id, updatedSb) => {
  return (dispatch, getState) => {
    var sbRef = firebaseRef.child(`publicSbs/${id}`)
    return sbRef.update(updatedSb).then(() => {
      dispatch(updateSb(id, updatedSb))
    })
  }
}

export var updateSb = (id, updatedSb) => {
  return {
    type: 'UPDATE_SB',
    id,
    updatedSb
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
