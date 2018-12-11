require('../../config/environment.js')
const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const getUserByToken = async (token) => {
  const client = await MongoClient.connect(url,{useNewUrlParser: true})
  const db = client.db(dbName)

  try {
    const user = await db.collection('users').findOne({'tokens.token': token})
    return user
  } catch (e) {
    throw e
  } finally {
    await client.close()
  }
}

module.exports = {getUserByToken}
