import isEmpty from '../utils/isEmpty'

const initialState = {
  isAuthenticate:false,
  avatar:'',
  username:''
}

export const authenticationReducer = (state = initialState ,action) => {
  switch (action.type) {
    case 'REGISTER_USER':
      return {...state}
    case 'SET_CURRENT_USER':
      return {
        ...state,
        isAuthenticate: !isEmpty(action.token)
      }
    case 'GET_CURRENT_USER':
      return {
        ...state,
        avatar: action.avatar,
        username:action.username,

      }

    case 'LOGOUT_USER':
      return {
        ...state,
        isAuthenticate:false,
        avatar:'',
        username:''
      }
    default:
      return state
  }
}
