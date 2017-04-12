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
    case 'LOGOUT':
      return []
    case 'ADD_VOTE':
      return state.map((sb) => {
        if (sb.id === action.sbId) {
          sb.choices.map((choice) => {
            if (choice.id === action.choiceId) {
              choice.votes++
            }
          })
        }
        return sb
      })
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
