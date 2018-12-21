import axios from 'axios'
import { modalLoginClose, modalRegisterClose, modalVerifyEmailOpen } from './modalAction'
import setAuthToken from '../utils/setAuthToken'
import { clearErrors } from './errorsAction'
//import { eraseCookie, setCookie } from '../utils/cookie'

//const cookieName = 'my-proposal'
export const temporaryRegisterUser = (user) => dispatch => {
  dispatch(clearErrors())
  axios.post('api/users/temporaryRegister',user)
    .then((res) => {
      dispatch({
        type:'TEMPORARY_REGISTER_USER',
        message:res.data.message
      })
      dispatch(modalRegisterClose())
      dispatch(modalVerifyEmailOpen())
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    }))
}

export const registerUser = (username) => dispatch => {
  axios.post(`api/users/register/${username}`)
    .then((res) => {
      console.log(res.data)
      dispatch({
        type:'REGISTER_USER'
      })
      dispatch(modalRegisterClose())
      dispatch(modalVerifyEmailOpen())
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    }))
}

export const loginUser = (user,history) => dispatch => {

  axios.post('api/users/login',user)
    .then(res => {
      const token = res.data.tokens[0].token
      const username = res.data.username
      const avatar = res.data.avatar
      const name = res.data.name
      const email = res.data.email
      //setCookie(cookieName,token,15)
      setAuthToken(token)
      dispatch(modalLoginClose())
      dispatch(setCurrentUser(token))
      dispatch({
        type:'GET_CURRENT_USER',
        avatar,
        username,
        name,
        email
      })
     history.push(`/${username}`)
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
  }))
}

export const setCurrentUser = (token) => ({
  type:'SET_CURRENT_USER',
  token
})
export const getCurrentUser = (username) => dispatch => {
  dispatch(loadingUser())
  axios.get(`api/users/username/${username}`)

    .then(res => {
       dispatch({
         type:'GET_CURRENT_USER',
         avatar:res.data.avatar,
         username:res.data.username,
         name:res.data.name,
         email:res.data.email
       })
    })
    .catch(err => {
      return dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    })})
}

export const logoutUser = () => dispatch => {
  axios.post('api/users/logout')
    .then(() => {
      setAuthToken(false)
      //eraseCookie(cookieName)

    }).then(() => {
    dispatch({
      type:'LOGOUT_USER'
    })
  })
    .catch(err => {
      console.log(err)
      dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    })})
}

export const loadingUser = () => {
  return {
    type: 'LOADING_USER'
  }
}
