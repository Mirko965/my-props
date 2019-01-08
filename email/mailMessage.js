const fs = require('fs')

const registerMail = (url,username) => {
  fs.createReadStream(
    `<h2>Welcome to MERN</h2>\n\n`+
    `<p>Click on the link below to verify your email address</p>\n\n`+
    `<link>${url}/api/users/register/${username}</link>`
  );
}

const passwordMail = (url,username) => {
  fs.createReadStream(
    `<h2>Welcome to MERN</h2>\n\n`+
    `<p>Click on the link below to change your password</p>\n\n`+
    `<link>${url}/api/users/register/${username}</link>`
  );
}

module.exports = {registerMail,passwordMail}
