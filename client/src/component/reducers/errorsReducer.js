const initialState = {}
export  const errorsReducer = (state = initialState,action) => {
  switch (action.type) {
    case 'GET_ERRORS':
      return action.errors
    case 'CLEAR_ERRORS':
      return action.errors
    default:
      return state
  }
}
