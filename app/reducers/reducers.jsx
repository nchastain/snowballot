export const sbsReducer = (state = [], action) => {
  switch (action.type) {
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
