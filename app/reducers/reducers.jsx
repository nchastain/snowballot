export const sbsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SB':
      return [
        ...state,
        action.sb
      ]
    case 'ADD_SBS':
      return [
        ...state,
        ...action.sbs
      ]
    case 'UPDATE_SB':
      return state.map((sb) => {
        return sb.id === action.id ? action.updatedSb : sb
      })
    case 'LOGOUT':
      return []
    default:
      return state
  }
}

export var authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid
      }
    case 'LOGOUT':
      return {}
    default:
      return state
  }
}

export var privateSbsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PRIVATE_SB':
      return [
        ...state,
        action.sb
      ]
    case 'ADD_PRIVATE_SBS':
      return [
        ...state,
        ...action.sbs
      ]
    case 'CLEAR_PRIVATE_SBS':
      return []
    default:
      return state
  }
}
