require('../../config/environment.js')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const tempPassword = async (username,newPassword,oldPassword) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    const user = await db.collection('users').findOne({username})
    const pass = await bcrypt.compare(oldPassword, user.password)
    if (pass){
      const salt = await bcrypt.genSalt(10)
      const hash =await bcrypt.hash(newPassword,salt)
      const tempPass = await db.collection('temporaryPassword').findOneAndUpdate(
        {username},
        {$set: {password: hash}}, {upsert:true})
      return tempPass
    } else {
      return {error:'old password do not match'}
    }

  } catch (err) {
    throw err
  } finally {
    await client.close()
  }
}

const changePassword = async (username) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    const user = await db.collection('temporaryPassword').findOne({username})
    const tempPass = user.password
    const changePass = await db.collection('users').findOneAndUpdate(
      {username},
      {$set: {password: tempPass}})
    return changePass
  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}

module.exports = {tempPassword,changePassword}
