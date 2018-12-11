require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const schemaUser = require('../schema/users')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const insertUser = async (name, email, password, username ) => {
  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  const db = await client.db(dbName)
  await db.createCollection('users', schemaUser)
  await db.collection('users').createIndex({email:1},{unique:true})
  await db.collection('users').createIndex({username:1},{unique:true})

  try {
    if (name && password && username){
      const salt = await bcrypt.genSalt(10)
      const hash =await bcrypt.hash(password,salt)
      const gravatarOptions = {s: '200', r: 'pg', d: 'mm'}
      const gravatarLink = await gravatar.url(email, gravatarOptions);
      const doc = {
        name: name.trim(),
        email: email.trim(),
        password:hash,
        avatar: gravatarLink,
        username: username.trim(),
        profile:{},
        tokens:[]
      }
      const user =  await db.collection('users').insertOne(doc)
      return user.ops[0]
    } return {mongodb:'password, email and username must be provided'}
  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}
// (async () => {
//   try {
//     const user = await insertUser("mirko","mirkojelic@gmail.com","pass","fion")
//     console.log(user)
//   } catch (e) {
//     console.log(e)
//   }
// })()

module.exports = { insertUser }
