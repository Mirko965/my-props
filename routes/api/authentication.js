require('../../config/environment.js')
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const {temporaryRegister} = require('../../mongoDB/authentication/temporaryRegister')
const {getUserByToken} = require('../../mongoDB/authentication/getUserByToken')
const {getUserByUserName} = require('../../mongoDB/authentication/getUserByUserName')
const {logoutUser} = require('../../mongoDB/authentication/logoutUser')
const {authenticate} = require('../../middleware/authenticate')
const {loginUser} = require('../../mongoDB/authentication/loginUser')
const {insertUser} = require('../../mongoDB/authentication/insertUser')

router.get('/test', asyncHandler(async (req,res) => {
  res.cookie('testCookie','foo')
  res.json({Msg: 'text from test'})
}))

router.post('/temporaryRegister', asyncHandler(async (req,res) => {
  const {errors, isValid} = await validateRegisterInput(req.body)
  const {email, name, password,password2, username} = req.body

  if (!isValid){
    return res.status(400).json(errors);
  }
  try {

    const user = await temporaryRegister(name, email, password, username)

    if (user.errUsername){
      errors.username = 'username already exist'
      return res.status(400).send(errors)
    } else if (user.errMail) {
      errors.email = 'email already exist'
      return res.status(400).send(errors)
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'mirkojelic.jelic@gmail.com',
        pass: 'fionfion0000'
      }
    })
    let mailOptions = {
      from: 'mirkojelic.jelic@gmail.com',
      to: 'mirkojelic.jelic@gmail.com',
      subject: 'Sending Email using Node.js',
      html: `<h2>Welcome to MERN</h2>\n\n`+
        `<p>Click on the link below to verify your email address</p>\n\n`+
        `<link>http://localhost:5000/api/users/register/${username}</link>`
    }
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.status(400).send(error);
      } else {
        const message = 'Email sent: ' + info.response
        return res.send({message})
      }
    });
    transporter.close()

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

router.get('/register/:username', asyncHandler(async (req,res) => {
  const {errors} = await validateRegisterInput(req.body)
  const username = req.params.username

  try {
    await insertUser(username)
    return res.redirect('http://mirkojelic.com/verify')
  } catch (err) {
    return res.status(400).json(errors)
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

      let options = {
        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
        //httpOnly: true, // The cookie only accessible by the web server
        //signed: true // Indicates if the cookie should be signed
      }

      const token = await user.tokens[0].token
      await res.cookie('my-proposal',token,options)
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
    let options = {
      maxAge: -(1000 * 60 * 60 * 24)
    }
    await res.cookie('my-proposal','',options)
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
      if (user && cookie === token) {
        return res.send(user)
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

