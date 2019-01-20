const fs = require('fs')

const registerMail = (url,username) => {
  fs.createReadStream(
    `<h2>Welcome to MERN</h2>\n\n`+
    `<p>Click on the link below to verify your email address</p>\n\n`+
    `<link>${url}/api/users/register/${username}</link>`
  );
}

const resetPasswordMail = (urlClient,token) => {
  return (
      `<h2>Welcome to MERN</h2>\n\n`+
      `<p>Click on the link below to change your password</p>\n\n`+
      `<link>${urlClient}/resetPassword/${token}</link>\n\n`+
      `<button onclick="location.href = urlClient+'/resetPassword/'+token">reset password</button>`
    )


}

module.exports = {resetPasswordMail,registerMail}
