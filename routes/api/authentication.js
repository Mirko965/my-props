require('../../config/environment.js')
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const cookieParser = require('cookie-parser')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const {getUserByToken} = require('../../mongoDB/authentication/getUserByToken')
const {getUserByUserName} = require('../../mongoDB/authentication/getUserByUserName')
const {logoutUser} = require('../../mongoDB/authentication/logoutUser')
const {authenticate} = require('../../middleware/authenticate')
const {loginUser} = require('../../mongoDB/authentication/loginUser')
const {insertUser} = require('../../mongoDB/authentication/insertUser')

router.get('/test', asyncHandler(async (req,res) => {
  res.json({Msg: 'text from test'})
}))

router.post('/register', asyncHandler(async (req,res) => {
  const {errors, isValid} = await validateRegisterInput(req.body)
  const {email, name, password,password2, username} = req.body

  if (!isValid){
    return res.status(400).json(errors);
  }
  try {
    const user = await insertUser(name, email, password, username)
    return res.send(user)
  } catch (err) {
    if (err.code === 11000) {
      if (err.errmsg.includes(email)) {
        errors.email = 'email already exist'
        return res.status(400).send(errors)
      } else if (err.errmsg.includes(username)) {
        errors.username = 'username already exist'
        return res.status(400).send(errors)
      }
    } else {
      errors.mongodb = err.name
      return res.status(400).send(errors)
    }
  }

}))

router.post('/login', asyncHandler(async (req,res) => {
  const {errors, isValid} = await validateLoginInput(req.body)
  const {email,password} = req.body
  if (!isValid){
    return res.status(400).json(errors);
  }
  try {
    if (email) {
      const user = await loginUser(email, password)
      if (user.tokens === undefined) {
        return res.status(400).json(user)
      }
      const token = await user.tokens[0].token
      await res.header('Authorization', token).send(user)
    } else {
      return res.status(400).json({user: undefined})
    }
  } catch (err) {
    errors.mongodb = err.name
    return res.status(400).json(errors)
  }
}))

router.post('/logout',authenticate, asyncHandler(async (req,res) => {
  try {
    const username = req.user.username
    const logout = await logoutUser(username)

    return res.send(logout)
  } catch (e) {
    return res.status(400).json(e)
  }
}))
router.get('/username/:username',authenticate, asyncHandler(async (req,res) => {
  const errors = {}

  try {
    const token = req.token
    const cookie = req.cookies['my-proposal']

      const username = req.params.username
      const user = await getUserByUserName(username)
      if (user) {
        return res.header('Authorization', token).send(user)
      }
      if(user.noUser){
        errors.noUser = user.noUser
        return res.status(400).send(errors)
      }


  } catch (err) {
    return res.status(400).json(err)
  }
}))

router.get('/me',authenticate, asyncHandler(async (req,res) => {
   const token = req.token

  try {
    const user = await getUserByToken(token)
    return res.send(user)
  } catch (e) {
     return res.status(401).send(e)
  }
}))

module.exports = router
