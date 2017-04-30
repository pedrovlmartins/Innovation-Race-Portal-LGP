const path = require('path');
const config = require(path.join(__base, 'config'));
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: config.mail.host,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
  secure: config.mail.ssl,
});

function send(to, subject, text, html, callback) {
  var mailOptions = {
    from: config.mail.from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    callback(error, info);
  });
};

module.exports = {
  send: send,
};
