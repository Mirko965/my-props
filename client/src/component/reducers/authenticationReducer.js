import isEmpty from '../utils/isEmpty'

const initialState = {
  isAuthenticate:false,
  avatar:'',
  username:'',
  loading:false
}

export const authenticationReducer = (state = initialState ,action) => {
  switch (action.type) {
    case 'LOADING_USER':
      return {
        ...state,
        loading: true
      }
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
        name:action.name,
        email:action.email,
        loading:false
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
