require('./config/environment')
const {app} = require('./app')

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
});





