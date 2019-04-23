import React, { Component } from 'react'
import {Provider} from 'react-redux'
import store from './store'
import AppRouter from './component/router/AppRouter'
import { eraseCookie, getCookie } from './component/utils/cookie'
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getUserForResetPassword
} from './component/actions/authenticationAction'
import setAuthToken from './component/utils/setAuthToken'
import jwt from 'jsonwebtoken'
import isEmpty from './component/utils/isEmpty'

const cookieName = 'my-proposal'
const token = getCookie(cookieName)
const resetPassToken = getCookie('reset-password')

    if (!isEmpty(token)){
      let decoded  = jwt.decode(token);
      setAuthToken(token);
      store.dispatch(setCurrentUser(token));
      store.dispatch(getCurrentUser(decoded.username));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/';
      }
    } else if (!isEmpty(resetPassToken) && isEmpty(token)){
      let decoded  = jwt.decode(resetPassToken);
      store.dispatch(getUserForResetPassword(decoded.username));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        eraseCookie('reset-password')
        window.location.href = `/`;
      }
    }

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <AppRouter/>
      </Provider>
    )
  }
}

export default App
