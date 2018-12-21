require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const schemaUser = require('../schema/users')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const insertUser = async (username) => {
  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  const db = await client.db(dbName)
  await db.createCollection('users', schemaUser)
  await db.collection('users').createIndex({email:1},{unique:true})
  await db.collection('users').createIndex({username:1},{unique:true})

  try {
    const doc = await db.collection('temporaryUsers').findOne({username})
    const user =  await db.collection('users').insertOne(doc)
    await db.collection('temporaryUsers').deleteOne({username})
    return user.ops[0]
  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}


module.exports = { insertUser }
