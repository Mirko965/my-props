import axios from 'axios'
import {
  modalLoginClose,
  modalLoginOpen,
  modalChangePasswordClose,
  modalRegisterClose,
  modalVerifyEmailOpen, modalChangePasswordVerifyOpen
} from './modalAction'
import setAuthToken from '../utils/setAuthToken'
import { clearErrors } from './errorsAction'
import isEmpty from '../utils/isEmpty'
import { getCookie } from '../utils/cookie'
import jwt from 'jsonwebtoken'

const urlClient = process.env.REACT_APP_CLIENT_URL
const urlServer = process.env.REACT_APP_SERVER_URL

//const cookieName = 'my-proposal'
export const temporaryRegisterUser = (user) => dispatch => {

  dispatch(clearErrors())

  axios.post(`${urlClient}/api/users/temporaryRegister`,user)
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

export const tempPassword = (username,data,history) => dispatch => {

  dispatch(clearErrors())
  axios.post(`${urlClient}/api/users/tempPassword/${username}`,data)
    .then(res => {
      dispatch({
        type:'TEMPORARY_PASSWORD',
        message:res.data
      })
      dispatch(modalChangePasswordClose())
      history.push('/authentication')
      dispatch(modalChangePasswordVerifyOpen())
    })
    .catch(err => dispatch({
      type:'GET_ERRORS',
      errors:err.response.data
    }))
}

export const registerUser = (username) => dispatch => {

  axios.post(`${urlClient}/api/users/register/${username}`)
    .then(() => {
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

  axios.post(`${urlClient}/api/users/login`,user)
    .then(res => {
      const token = res.data.tokens[0].token
      const username = res.data.username
      const avatar = res.data.avatar
      const name = res.data.name
      const email = res.data.email

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

export const deleteUser = (username,history) => dispatch => {

  if (window.confirm('Are You shure?? This action can not be undone')){
    axios.delete(`${urlClient}/api/users/delete/${username}`)
      .then(() => {
        dispatch({type:'DELETE_USER'})
        history.push('/')
      })
      .catch(err => {
        dispatch({
          type:'GET_ERRORS',
          errors:err.response.data
        })})
  }
}

export const setCurrentUser = (token) => ({
  type:'SET_CURRENT_USER',
  token
})
export const getCurrentUser = (username) => dispatch => {
  dispatch(loadingUser())
  //axios.get(`api/users/username/${username}`)
  axios.get(`${urlClient}/api/users/username/${username}`)

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
  axios.post(`${urlServer}/api/users/logout`)
    .then(() => {
      setAuthToken(false)
    }).then(() => {
    dispatch({
      type:'LOGOUT_USER'
    })
  })
    .catch(err => {
      dispatch({
        type:'GET_ERRORS',
        errors:err.response.data
      })})
}

export const mailForResetPassword = (email) => dispatch => {
  if (isEmpty(email)){
    dispatch({
      type:'GET_ERRORS',
      errors:{email:'Email field must provide'}
    })
  } else {
    axios.get(`${urlClient}/api/users/mailForResetPassword/${email}`)
      .then(((res) => {
        const username = res.data.username
        dispatch({
          type:'RESET_PASSWORD',
          isAuthenticate:true,
          username,
          email:res.data.mail,
          avatar:res.data.avatar,
          message:res.data.message
        })
        dispatch({
          type:'GET_USER_FOR_RESET_PASSWORD',
          avatar:res.data.avatar,
          username:res.data.username,
        })
      }))
      .then(() => dispatch({
        type:'MODAL_FORGOT_PASSWORD_CLOSE'
      }))
      .then(() => dispatch({
        type:'MODAL_FORGOT_PASSWORD_VERIFY_OPEN'
      }))
      .catch(err => {
        dispatch({
          type:'GET_ERRORS',
          errors:err.response.data
        })})
  }

}

export const resPassword = (newPassword,newPassword2,history) => dispatch => {
  const token = getCookie('reset-password')

  if (!token){
    dispatch({
      type:'GET_ERRORS',
      errors:{password : 'You are not authorized'}
    })
  } else {
    let decoded  = jwt.decode(token);
    const username = decoded.username

    axios({
      method: 'post',
      url: `${urlClient}/api/users/resetPassword/${username}`,
      data: {
        newPassword,
        newPassword2
      }
    })
      .then(() => {
        dispatch(clearErrors())
        dispatch({
          type:'REMOVE_USER'
        })
        history.push('/authentication')
        dispatch(modalLoginOpen())
      })
      .catch(err => {
        dispatch({
          type:'GET_ERRORS',
          errors:err.response.data
        })})
  }
}


export const getUserForResetPassword = (username) => dispatch => {
  dispatch(loadingUser())
  axios.get(`${urlClient}/api/users/resetPassword/${username}`)

    .then(res => {
      dispatch({
        type:'GET_USER_FOR_RESET_PASSWORD',
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

export const loadingUser = () => {
  return {
    type: 'LOADING_USER'
  }
}




