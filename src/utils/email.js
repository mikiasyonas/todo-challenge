const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendMail = (to, subject, html) => {
  const companyEmail = config.app.email_username;
  const emailPassword = config.app.email_password;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: companyEmail,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: companyEmail,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return {
        success: false,
        err: err,
      };
    } else {
      return {
        success: true,
        message: info,
      };
    }
  });
};

module.exports = {
  sendMail,
};

