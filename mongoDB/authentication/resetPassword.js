require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const fs = require('fs')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
const secret = process.env.JWT_SECRET

const resetPassword = async (username,password) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    const salt = await bcrypt.genSalt(10)
    const hash =await bcrypt.hash(password,salt)
    const user = await db.collection('users').findOneAndUpdate(
      {username},
      {$set: {password:hash}},
      {returnOriginal: false}
    )
    if (user.lastErrorObject.updatedExisting === true){
      return user
    }

  } catch (e) {
    throw e
  } finally {
    await client.close()
  }

}
module.exports = {resetPassword}
