import axios from 'axios'
import { modalLoginClose, modalLoginOpen, modalRegisterClose } from './modalAction'
import setAuthToken from '../utils/setAuthToken'
import { eraseCookie, setCookie } from '../utils/cookie'

const cookieName = 'my-proposal'
export const registerUser = (user) => dispatch => {
  axios.post('api/users/register',user)
    .then(() => {
      dispatch({
        type:'REGISTER_USER'
      })
      dispatch(modalRegisterClose())
      dispatch(modalLoginOpen())
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
      setCookie(cookieName,token,15)
      setAuthToken(token)
      dispatch(modalLoginClose())
      dispatch(setCurrentUser(token))
      dispatch({
        type:'GET_CURRENT_USER',
        avatar,
        username
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

  axios.get(`api/users/username/${username}`)
    .then(res => {
       dispatch({
         type:'GET_CURRENT_USER',
         avatar:res.data.avatar,
         username:res.data.username,
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
      eraseCookie(cookieName)

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
