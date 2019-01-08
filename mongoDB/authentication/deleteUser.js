require('../../config/environment.js')
const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

const deleteUser = async (username) => {
  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  const db = client.db(dbName)

  try { await db.collection('users').deleteOne({username})
  } catch (err) {
    throw err
  } finally {
    await client.close()
  }

}
module.exports = { deleteUser }
