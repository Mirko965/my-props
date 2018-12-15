require('../../config/environment.js')
const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME


const logoutUser = async (username) => {
  const client = await MongoClient.connect(url,{ useNewUrlParser: true })
  const db = await client.db(dbName)
  try {
    const remove = await db.collection('users')
      .findOneAndUpdate(
        {username:username},
        {$pull: {tokens: {}}},
        {returnOriginal: false})

    if (remove.value !== null) {
      return remove.value
    } return createError(400,'You was already logout!!')

  } catch (err) {
    throw err
  } finally {
    await client.close()
  }
}
module.exports = {logoutUser}

