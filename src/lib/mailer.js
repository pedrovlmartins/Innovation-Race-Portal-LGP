const email = require('emailjs');

var from = 'Altran <altran@musaic.ml>';

var options = {
  user: '52c5cd0009cbb99f272734c8a5f2397a',
  password: 'c89caedf7d95d57eb0afcc334c813f92', // TODO: use environment variables
  host: 'in-v3.mailjet.com',
  ssl: true,
};

function send(to, subject, text, html, callback) {
  var server = email.server.connect(options);
  var message	= {
    text: text,
    from: from,
    to: to,
    subject: subject,
    attachment: [
        {
          data: html,
          alternative: true,
        },
      ],
  };
  server.send(message, function (err, message) {
    console.log(err || message);
    callback(err, message);
  });
};

module.exports = {
  send: send,
};
