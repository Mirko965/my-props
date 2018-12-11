require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const fs = require('fs')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
const secret = process.env.JWT_SECRET

//const privateKEY = fs.readFileSync('../../ssl/private_key','utf8');


const loginUser = async (email, password) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    if (email && password){
      const user = await db.collection('users').findOne({email})
      if (user) {
        const hash = user.password
        const pass = await bcrypt.compare(password, hash)

        if (pass === true) {
          const payload = {_id:user._id.toHexString(),username:user.username}
          const token = await jwt.sign(payload,secret,{ expiresIn: 60 * 60 * 24 * 10 }).toString()
          const userWithToken = await db.collection('users')
            .findOneAndUpdate(
              {_id:user._id},
              {$set: {tokens:[{token:token}]}},
              {returnOriginal: false})

          return userWithToken.value

        } return {password:'password is incorrect'}
      } return {email:'User not found'}
    } return {email:'password and email must provided'}
  } catch (e) {
    throw e
  } finally {
    client.close()
  }
}
module.exports = {loginUser};

// (async () => {
//   const email = 'tijanajelic.jelic@gmail.com'
//   const pass = 'pass'
//   try {
//     const user = await loginUser(email,pass)
//     console.log(user)
//   } catch (e) {
//     console.log(e)
//   }
// })()

