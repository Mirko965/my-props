 require('../config/environment.js')
 const { MongoClient ,ObjectID} = require('mongodb')
 const jwt = require('jsonwebtoken')
 //const fs = require('fs')
 //const path = require('path')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
const secret = process.env.JWT_SECRET

const findByToken = async (token) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    const decoded = jwt.verify(token,secret)
    console.log(decoded)
    const _id = ObjectID(decoded._id)

    const user = await db.collection('users').findOne({_id})
    console.log(user)
    return user
  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}


module.exports = {findByToken}


