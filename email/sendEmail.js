const nodemailer = require('nodemailer');

const sendEmail = (user,pass,from,to) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user,
      pass
    }
  })
  let mailOptions = {
    from,
    to,
    subject: 'Sending Email using Node.js',
    html: `<h2>Welcome to MERN</h2>\n\n`+
      `<p>Click on the link below to verify your email address</p>\n\n`+
      `<link>${url}/api/users/register/${username}</link>`
  }
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      res.status(400).send(error);
    } else {
      const message = 'Email sent: ' + info.response
      return res.send({message})
    }
  });
  transporter.close()
}
