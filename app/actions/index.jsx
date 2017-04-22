import moment from 'moment'
import firebase from 'firebase'
import {firebaseRef, githubProvider, firebaseAuth} from '.././firebase/constants.js'

export var addSb = (sb) => {
  return {
    type: 'ADD_SB',
    sb
  }
}

export var showSb = (sb) => {
  return {
    type: 'SHOW_SB',
    sb
  }
}

export var showVote = (voted, choice) => {
  return {
    type: 'SHOW_VOTE',
    voted,
    choice
  }
}

export var showUserSbs = (sbs) => {
  return {
    type: 'SHOW_USER_SBS',
    sbs
  }
}

export var addSbs = (sbs) => {
  return {
    type: 'ADD_SBS',
    sbs
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

export var logout = () => {
  return {
    type: 'LOGOUT'
  }
}

export var findSb = (sbAlias) => {
  return (dispatch, getState) => {
    var sbRef = firebaseRef.child(`sbs`).orderByChild('alias').equalTo(sbAlias)

    return sbRef.once('value').then((snapshot) => {
      var sb = snapshot.val() || {} // sb is an object with a single key whose value is the object we want
      var realSb = sb[Object.keys(sb)[0]]
      var parsedSb = Object.assign({}, realSb, {id: Object.keys(sb)[0]}) // Firebase keys snowballots on IDs, but we want the ID in the object itself
      dispatch(showSb(parsedSb))
      if (getState().user.uid) dispatch(findVote(parsedSb.id))
    })
  }
}

export var findVote = (sbId) => {
  return (dispatch, getState) => {
    var votingRef = firebaseRef.child(`users/${getState().user.uid}/votes/${sbId}`)

    return votingRef.once('value').then((snapshot) => {
      var voted = Boolean(snapshot.val())
      var choice = snapshot.val()
      dispatch(showVote(voted, choice))
    })
  }
}

export var findPublicSbs = () => {
  return (dispatch, getState) => {
    var publicSbsRef = firebaseRef.child(`sbs`).orderByChild('isPrivate').equalTo(false)

    return publicSbsRef.once('value').then((snapshot) => {
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

export var findUserSbs = (userId) => {
  return (dispatch, getState) => {
    var userSbsRef = firebaseRef.child(`sbs`).orderByChild('creator').equalTo(userId)

    return userSbsRef.once('value').then((snapshot) => {
      var sbs = snapshot.val() || {}
      var parsedSbs = []

      Object.keys(sbs).forEach((sbId) => {
        parsedSbs.push({
          id: sbId,
          ...sbs[sbId]
        })
      })
      dispatch(showUserSbs(parsedSbs))
    })
  }
}

export var startAddSb = (options, choices) => {
  return (dispatch, getState) => {
    const sb = {
      ...options,
      choices,
      createdAt: moment().unix(),
      creator: getState().user.uid
    }
    const sbRef = firebaseRef.child(`sbs`).push(sb)

    return sbRef.then(() => {
      dispatch(addSb({...sb, id: sbRef.key}))
    })
  }
}

export var startUpdateUser = (sbId, choiceId, fresh) => {
  return (dispatch, getState) => {
    var votedSbRef = firebaseRef.child(`users/${getState().user.uid}/votes/`)
    return fresh ? votedSbRef.update({[sbId]: choiceId}) : votedSbRef.child(`${sbId}`).remove()
  }
}

export var startUpdateSb = (id, choiceId, updatedSb, fresh) => {
  return (dispatch, getState) => {
    var sbRef = firebaseRef.child(`sbs/${id}`)
    var userRef = firebaseRef.child(`users/${getState().user.uid}`)
    if (userRef) dispatch(startUpdateUser(id, choiceId, fresh))
    return sbRef.update(updatedSb).then(() => {
      dispatch(updateSb(id, updatedSb))
    })
  }
}
