const SMTPConnection = require('smtp-connection');

var from = 'testemail@musaic.ml';

var options = {
  host: 'in-v3.mailjet.com',
  secure: true,
};

var auth = {
  user: '52c5cd0009cbb99f272734c8a5f2397a',
  pass: 'c89caedf7d95d57eb0afcc334c813f92',
};

function send(to, subject, text, callback) {
  var connection = new SMTPConnection(options);
  connection.connect(function () {
    connection.login(auth, function (err) {
      var envelope = {};
      envelope.from = from;
      envelope.to = to;
      envelope.subject = subject;
      connection.send(envelope, text, function (err, info) {
        console.log(envelope, text);
        connection.quit();
      });
    });
  });
};

module.exports = {
  send: send,
};
