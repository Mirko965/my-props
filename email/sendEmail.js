const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');

const authEmail = process.env.EMAIL_ADDRESS

const sendEmail = async (email,template, subject, context = {}) => {
  aws.config.loadFromPath('/home/centos/.AWS/config.json');

  let transporter = await nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: '2010-12-01'
    })
  });
  const options = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: 'views/',
      layoutsDir: 'views/'
    },
    viewPath: 'views/',
    extName: '.handlebars'
  }
  const mail = {
    from: authEmail,
    to: email,
    subject,
    template,
    context
  }
  await transporter.use('compile', hbs(options))

  try {
    return await transporter.sendMail(mail)
  } catch (e) {
    console.log(e)
    throw e
  } finally {
    await transporter.close()
  }
}

module.exports = {sendEmail}

