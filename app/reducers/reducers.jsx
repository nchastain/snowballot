export const sbsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SB':
      return [
        ...state,
        action.sb
      ]
    case 'ADD_SBS':
      return action.sbs
    default:
      return state
  }
}

export const sbReducer = (state = [], action) => {
  switch (action.type) {
    case 'SHOW_SB':
      return action.sb
    case 'SHOW_VOTE':
      return {
        ...state,
        userVoted: action.voted,
        userChoice: action.choice
      }
    case 'UPDATE_SB':
      return action.updatedSb
    default:
      return state
  }
}

export var userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        uid: action.uid,
        photoURL: action.photoURL,
        displayName: action.displayName,
        email: action.email
      }
    case 'SHOW_USER_SBS':
      return {
        ...state,
        sbs: action.sbs
      }
    default:
      return state
  }
}
