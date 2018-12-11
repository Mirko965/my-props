require('../config/environment.js')
const asyncHandler = require('express-async-handler')
const {findByToken} = require('./findByToken')

const authenticate = asyncHandler(async (req,res,next) => {
  try {
    const token = req.header('Authorization')

    if (token){
      const user = await findByToken(token)

      req.user = user
      req.token = token
      req._id = user._id
      next()
    } else {
      next()
    }
  } catch (e) {
    res.status(401)
    next()
  }
})


module.exports = {authenticate}
