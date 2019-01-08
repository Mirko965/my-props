require('../../config/environment.js')
const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const getUserByEmail = async (email) => {
  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  const db = await client.db(dbName)

  try {
    const user = await db.collection('users').findOne({email})

    if (user){
      return user
    } return {noUser:'User not found'}

  } catch (err) {
    throw err
  } finally {
    await client.close()
  }
}

module.exports = { getUserByEmail };

