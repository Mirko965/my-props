import isEmpty from '../utils/isEmpty'

const initialState = {
  isAuthenticate:false,
  avatar:'',
  username:'',
  password:'',
  email:'',
  loading:false,
  message:'',
  name:''
}

export const authenticationReducer = (state = initialState ,action) => {
  switch (action.type) {
    case 'LOADING_USER':
      return {
        ...state,
        loading: true
      }
    case 'TEMPORARY_REGISTER_USER':
    return {...state,
      message:action.message
      }
    case 'TEMPORARY_PASSWORD':
      return {
        ...state,
        message:action.message
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
    case 'GET_USER_FOR_RESET_PASSWORD':
      return {
        ...state,
        isAuthenticate:false,
        avatar: action.avatar,
        username:action.username,
        loading:false
      }
    case 'LOGOUT_USER':
      return {
        ...state,
        isAuthenticate:false,
        avatar:'',
        username:'',
        password:'',
        email:'',
        loading:false,
        message:'',
        name:''
      }
    case 'REMOVE_USER':
      return {
        isAuthenticate:false,
        avatar:'',
        username:'',
        loading:false,
        message:''
      }
    case 'RESET_PASSWORD':
      return {
        ...state,
        username:action.username,
        isAuthenticate:action.isAuthenticate,
        avatar:action.avatar,
        email:action.email,
        message:action.message
      }
    default:
      return state
  }
}
