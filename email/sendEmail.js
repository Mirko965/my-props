const nodemailer = require('nodemailer');
//const aws = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');

const authEmail = process.env.EMAIL_ADDRESS

const sendEmail = async (template, subject, context = {}) => {
  //aws.config.loadFromPath('/home/ec2-user/.AWS/config.json');

  /*let transporter = await nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: '2010-12-01'
    })
  });*/
  let transporter = await nodemailer.createTransport("SMTP", {
    host: "email-smtp.us-east-1.amazonaws.com",
    secureConnection: true,
    port: 465,
    auth: {
      user: process.env.AWS_SMTP_USERNAME,
      pass: process.env.AWS_SMTP_PASSWORD
    }
  });
  console.log(transporter)
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
    to: authEmail,
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

