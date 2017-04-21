import moment from 'moment'
import firebase from 'firebase'
import {firebaseRef, githubProvider, firebaseAuth} from '.././firebase/constants.js'

export var addSb = (sb) => {
  return {
    type: 'ADD_SB',
    sb
  }
}

export var startAddSb = (options, choices) => {
  return (dispatch, getState) => {
    const sb = {
      ...options,
      choices,
      createdAt: moment().unix(),
      creator: getState().auth.uid
    }
    const sbRef = firebaseRef.child(`sbs`).push(sb)

    return sbRef.then(() => {
      dispatch(addSb({...sb, id: sbRef.key}))
    })
  }
}

export var startAddSbs = () => {
  return (dispatch, getState) => {
    var sbsRef = firebaseRef.child(`sbs`)

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

export var startUpdateUser = (sbId, choiceId) => {
  return (dispatch, getState) => {
    var votedSbRef = firebaseRef.child(`users/${getState().auth.uid}/votes/`)
    return votedSbRef.update({[sbId]: choiceId}).then(() => {
      dispatch(updateUser(sbId, choiceId))
    })
  }
}

export var startAddVotes = (userId) => {
  return (dispatch, getState) => {
    var userVotesRef = firebaseRef.child(`users/${userId}/votes`)
    return userVotesRef.once('value').then((snapshot) => {
      var votes = snapshot.val() || {}
      dispatch(addVotes(votes))
    })
  }
}

export var addVotes = (votes) => {
  return {
    type: 'ADD_VOTES',
    votes
  }
}

export var updateUser = (sbId, choiceId) => {
  return {
    type: 'UPDATE_USER',
    sbId,
    choiceId
  }
}

export var addSbs = (sbs) => {
  return {
    type: 'ADD_SBS',
    sbs
  }
}

export var startUpdateSb = (id, choiceId, updatedSb) => {
  return (dispatch, getState) => {
    var sbRef = firebaseRef.child(`sbs/${id}`)
    var userRef = firebaseRef.child(`users/${getState().auth.uid}`)
    if (userRef) dispatch(startUpdateUser(id, choiceId))
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
      dispatch(startAddSbs())
    })
  }
}
