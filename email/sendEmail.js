const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const url = process.env.URL
const urlClient = process.env.URL_CLIENT
const authEmail = process.env.EMAIL_ADDRESS
const authPass = process.env.EMAIL_PASS
const secret = process.env.JWT_SECRET

const sendEmail = async (template, subject, context = {}) => {

  let transporter = await nodemailer.createTransport({
    service: 'gmail',
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: authEmail,
      pass: authPass
    }
  })
  const options = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: 'D:\\my_proposal\\views\\',
      layoutsDir: 'D:\\my_proposal\\views\\'
    },
    viewPath: 'D:\\my_proposal\\views\\',
    extName: '.handlebars'
  }
  var mail = {
    from: authEmail,
    to: authEmail,
    subject,
    template,
    context
  }
  await transporter.use('compile', hbs(options))
  try {
    const sendmail = await transporter.sendMail(mail);
    return sendmail
  } catch (e) {
    console.log(e)
    throw e
  } finally {
    await transporter.close()

  }

}


module.exports = {sendEmail}
