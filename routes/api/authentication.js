require('../../config/environment.js')
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const validateChangePassword = require('../../validation/changePassword')
const validateForgotPassword = require('../../validation/forgotPassword')
const mailForForgotPassword = require('../../validation/mailForForgotPassword')
const {resetPassword} = require('../../mongoDB/authentication/resetPassword')
const {getUserByEmail} = require('../../mongoDB/authentication/getUserByEmail')
const {tempPassword,changePassword} = require('../../mongoDB/authentication/changePassword')
const {deleteUser} = require('../../mongoDB/authentication/deleteUser')
const {temporaryRegister} = require('../../mongoDB/authentication/temporaryRegister')
const {getUserByToken} = require('../../mongoDB/authentication/getUserByToken')
const {getUserByUserName} = require('../../mongoDB/authentication/getUserByUserName')
const {logoutUser} = require('../../mongoDB/authentication/logoutUser')
const {authenticate} = require('../../middleware/authenticate')
const {loginUser} = require('../../mongoDB/authentication/loginUser')
const {insertUser} = require('../../mongoDB/authentication/insertUser')
const url = process.env.URL
const urlClient = process.env.URL_CLIENT
const authEmail = process.env.EMAIL_ADDRESS
const authPass = process.env.EMAIL_PASS
const secret = process.env.JWT_SECRET

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
    const payload = {username:user.username}
    const token = await jwt.sign(payload,secret,{ expiresIn: 60 * 15 }).toString()
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
        user: authEmail,
        pass: authPass
      }
    })
    let mailOptions = {
      from: authEmail,
      to: email,
      subject: 'Sending Email using Node.js',
      html: `<h2>Welcome to MERN</h2>\n\n`+
        `<p>Click on the link below to verify your email address</p>\n\n`+
        `<link>${url}/api/users/register/${token}</link>`
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

router.get('/register/:token', asyncHandler(async (req,res) => {
  const {errors} = await validateRegisterInput(req.body)
  const token = req.params.token

  try {
    const decode = jwt.decode(token)
    const username = decode.username
    await insertUser(username)
    return res.redirect(`${urlClient}/verifyRegistration`)
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
      await res.clearCookie('reset-password')
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

router.delete('/delete/:username',authenticate, asyncHandler(async (req,res) => {
  const user = req.params.username
  const username = req.user.username

  try {
    if (user === username) {
      const delUser = await deleteUser(user)

      await res.clearCookie('my-proposal')
      return res.send(delUser)
    } return res.status(400).send({errors:'User not found'})

  } catch (err) {
    return res.status(400).json(err)
  }
}))

router.post('/tempPassword/:username',authenticate, asyncHandler(async (req,res) => {

  const {errors, isValid} = await validateChangePassword(req.body)
  if (!isValid){
    return res.status(400).json(errors)
  }
  try {
    const user =  req.user.username
    const username = req.params.username
    const {newPassword,oldPassword,email} = req.body

    if (user === username) {
      const payload = {username:user}
      const token = jwt.sign(payload,secret,{expiresIn: 60 * 15})
      const change = await tempPassword(username, newPassword, oldPassword)
      if (change.error){
        errors.oldPassword = change.error
        return res.status(400).send(errors)
      }

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: authEmail,
          pass: authPass
        }
      })
      let mailOptions = {
        from: authEmail,
        to: email,
        subject: 'Sending Email using Node.js',
        html: `<h2>Welcome to MERN</h2>\n\n`+
          `<p>Click on the link below to change your password</p>\n\n`+
          `<link>${url}/api/users/changePassword/${token}</link>`
      }
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          errors.oldPassword = 'User not found'
          return res.status(400).send(errors)
        } else {
          const message = 'Email sent: ' + info.response
          return res.send({...change,message})
        }
      });
      transporter.close()

    }
  } catch (e) {
    return res.status(401).send({errors: 'You are not authorized'})
  }
}))

router.get('/changePassword/:username',authenticate, asyncHandler(async (req,res) => {

  try {
    const token = req.params.username
    const decode = jwt.decode(token,secret)
    const username = decode.username
    await changePassword(username)
    res.redirect(`http://localhost:3000/verifyPassword`)
  } catch (err) {
    res.status(400).send(err)
  }
}))

router.get('/mailForResetPassword/:email', asyncHandler(async (req,res) => {

  try {
    const email = req.params.email
    const user = await getUserByEmail(email)


    if (user){
      const payload = {username:user.username}
      const token = await jwt.sign(payload,secret,{ expiresIn: 60 * 15 }).toString()
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: authEmail,
          pass: authPass
        }
      })
      let mailOptions = {
        from: authEmail,
        to: email,
        subject: 'Sending Email using Node.js',
        html: `<h2>Welcome to MERN</h2>\n\n`+
          `<p>Click on the link below to reset your password</p>\n\n`+
          `<link>http://localhost:3000/resetPassword/${token}</link>`
      }
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          errors.oldPassword = 'User not found'
          return res.status(400).send(errors)
        } else {
          const message = 'Email sent: ' + info.response


          let options = {
            maxAge: 1000 * 60 * 15
          }

          await res.cookie('reset-password',token,options)
          await res.header('Authorization', token).send({...user,message})
        }
      });
      transporter.close()
    }
  } catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/resetPassword/:username', asyncHandler(async (req,res) => {
  const {errors, isValid} = await validateForgotPassword(req.body)

  if (!isValid){
    return res.status(400).json(errors)
  }
  try {
    const username = req.params.username
    const {newPassword} = req.body

    const user = await resetPassword(username,newPassword)
    if (user){
      res.clearCookie('reset-password')
      return res.send(user)
    } return res.status(400).send(errors)

  } catch (e) {
    res.status(400).send(e)
  }
}))

router.get('/resetPassword/:username', asyncHandler(async (req,res) => {
  const errors = {}
  try {

    const username = req.params.username

    const user = await getUserByUserName(username)

    if (user) {
      await res.clearCookie('reset-password')
      await res.send(user)
    }
    if(user.noUser){
      errors.noUser = user.noUser
      return res.status(400).send(errors)
    }

  } catch (err) {
    return res.sendStatus(400)
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

