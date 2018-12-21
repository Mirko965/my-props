require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const isEmpty = require('../../validation/isEmpty')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const schemaUser = require('../schema/users')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const temporaryRegister = async (name, email, password, username ) => {
  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  const db = await client.db(dbName)
  await db.createCollection('temporaryUsers', schemaUser)
  await db.collection('temporaryUsers').createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60*60*24})
  await db.collection('temporaryUsers').createIndex({email:1},{unique:true})
  await db.collection('temporaryUsers').createIndex({username:1},{unique:true})

  try {

      const salt = await bcrypt.genSalt(10)
      const hash =await bcrypt.hash(password,salt)
      const gravatarOptions = {s: '200', r: 'pg', d: 'mm'}
      const gravatarLink = await gravatar.url(email, gravatarOptions);
      const doc = {
        createdAt: new Date(),
        name: name.trim(),
        email: email.trim(),
        password:hash,
        avatar: gravatarLink,
        username: username.trim(),
        profile:{},
        tokens:[]
      }
      const userUsername = await db.collection('users').findOne({username});
      const userEmail = await db.collection('users').findOne({email});

      if (isEmpty(userUsername)){
        if (isEmpty(userEmail)) {
          const tempUser =  await db.collection('temporaryUsers').insertOne(doc)
          return tempUser.ops[0]
        }return {errMail:'username already exist'}
      } return {errUsername:'username already exist'}

  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}

module.exports = { temporaryRegister }
