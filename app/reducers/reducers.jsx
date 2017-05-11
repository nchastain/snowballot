export const sbsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SB':
      return [
        ...state,
        action.sb
      ]
    case 'DELETE_SB':
      return state.filter((sb) => sb.id !== action.id)
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

export const createdSbReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CREATED_SB':
      return {
        ...state,
        [action.choiceId]: action.updatedSections
      }
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
        email: action.email,
        favorites: action.favorites
      }
    case 'NEW_UPDATE_USER':
      return {
        ...state,
        [action.section]: {...state[action.section], ...action.updates}
      }
    case 'SHOW_USER_SBS':
      return {
        ...state,
        sbs: action.sbs
      }
    case 'SHOW_USER_INFO':
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}
