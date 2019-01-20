import axios from 'axios'
import {
  modalLoginClose,
  modalLoginOpen,
  modalChangePasswordClose,
  modalRegisterClose,
  modalVerifyEmailOpen, modalChangePasswordVerifyOpen
} from './modalAction'
import setAuthToken from '../utils/setAuthToken'
import { clearErrors, getErrors } from './errorsAction'
import isEmpty from '../utils/isEmpty'
import { eraseCookie, getCookie } from '../utils/cookie'
import jwt from 'jsonwebtoken'

const urlClient = process.env.REACT_APP_CLIENT_URL
const urlServer = process.env.REACT_APP_SERVER_URL

export const temporaryRegisterUser = (user) => async (dispatch) => {
  dispatch(clearErrors())
  const tempData = await axios.post(`${urlClient}/api/users/temporaryRegister`,user)
  try {
    dispatch({
      type: 'TEMPORARY_REGISTER_USER',
      message: tempData.data.message
    })
    dispatch(modalRegisterClose())
    dispatch(modalVerifyEmailOpen())
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const tempPassword = (username,data,history) => async dispatch => {
  const tempPass = await axios.post(`${urlClient}/api/users/tempPassword/${username}`,data)
  try {
    dispatch({
      type: 'TEMPORARY_PASSWORD',
      message: tempPass.data
    })
    dispatch(modalChangePasswordClose())
    history.push('/authentication')
    dispatch(modalChangePasswordVerifyOpen())
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const registerUser = username => async dispatch => {
  await axios.post(`${urlClient}/api/users/register/${username}`)
  try {
    dispatch({
      type: 'REGISTER_USER'
    })
    dispatch(modalRegisterClose())
    dispatch(modalVerifyEmailOpen())
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const loginUser = (user,history) => async dispatch => {
  const logUser = await axios.post(`${urlClient}/api/users/login`,user)
  try {
    const token = logUser.data.tokens[0].token
    const username = logUser.data.username
    const avatar = logUser.data.avatar
    const name = logUser.data.name
    const email = logUser.data.email
    setAuthToken(token)
    dispatch(modalLoginClose())
    dispatch(setCurrentUser(token))
    dispatch({
      type: 'GET_CURRENT_USER',
      avatar,
      username,
      name,
      email
    })
    history.push(`/${username}`)
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const deleteUser = (username,history) => async dispatch =>{
  if (window.confirm('Are You shure?? This action can not be undone')){
    await axios.delete(`${urlClient}/api/users/delete/${username}`)
    try {
      dispatch({type: 'REMOVE_USER'})
      history.push('/')
    } catch (err) {
      dispatch(getErrors(err))
    }
  }
}

export const setCurrentUser = (token) => ({
  type:'SET_CURRENT_USER',
  token
})

export const getCurrentUser = (username) => async dispatch => {
  dispatch(loadingUser())
  const getUser = await axios.get(`${urlClient}/api/users/username/${username}`)
  try {
    dispatch({
      type: 'GET_CURRENT_USER',
      avatar: getUser.data.avatar,
      username: getUser.data.username,
      name: getUser.data.name,
      email: getUser.data.email
    })
  } catch (err) {
    dispatch(getErrors(err))
  }
}

export const logoutUser = () => async dispatch => {
  await axios.post(`${urlServer}/api/users/logout`)
  try {
    await setAuthToken(false)
    await eraseCookie('my-proposal')
    await dispatch({type: 'LOGOUT_USER'})
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const mailForResetPassword = email => async dispatch => {
  if (isEmpty(email)) {
    dispatch({
      type: 'GET_ERRORS',
      errors: {email: 'Email field must provide'}
    })
  } else {
    const mail = await axios.get(`${urlClient}/api/users/mailForResetPassword/${email}`)
    try {
      const username = mail.data.username
      const avatar = mail.data.avatar
      dispatch({
        type: 'RESET_PASSWORD',
        isAuthenticate: true,
        username,
        email: mail.data.mail,
        avatar,
        message: mail.data.message
      })
      dispatch({
        type: 'GET_USER_FOR_RESET_PASSWORD',
        avatar,
        username
      })
      dispatch({type: 'MODAL_FORGOT_PASSWORD_CLOSE'})
      dispatch({type: 'MODAL_FORGOT_PASSWORD_VERIFY_OPEN'})
    } catch (err) {
      return dispatch(getErrors(err))
    }
  }
}

export const resPassword = (newPassword,newPassword2,history) => async dispatch => {
  const token = getCookie('reset-password')
  if (!token){
    dispatch({
      type:'GET_ERRORS',
      errors:{password : 'You are not authorized'}
     })
  } else {
    let decoded  = jwt.decode(token);
    const username = decoded.username
    await axios.post(`${urlClient}/api/users/resetPassword/${username}`,{newPassword,newPassword2})
    try {
      dispatch(clearErrors())
      dispatch({
        type: 'REMOVE_USER'
      })
      history.push('/authentication')
      dispatch(modalLoginOpen())
    } catch (err) {
      return dispatch(getErrors(err))
    }
  }
}

export const getUserForResetPassword = (username) => async dispatch => {
  dispatch(loadingUser())
  const getUser = await axios.get(`${urlClient}/api/users/resetPassword/${username}`)
  try {
    dispatch({
      type: 'GET_USER_FOR_RESET_PASSWORD',
      avatar: getUser.data.avatar,
      username: getUser.data.username,
    })
  } catch (err) {
    return dispatch(getErrors(err))
  }
}

export const loadingUser = () => {
  return {
    type: 'LOADING_USER'
  }
}

export const removeUser = () => {
  return {
    type: 'REMOVE_USER'
  }
}


