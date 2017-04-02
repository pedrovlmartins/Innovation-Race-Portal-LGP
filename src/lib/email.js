var API_KEY = 'key-8a223da75d748cb8ae494302ee675a05';
var DOMAIN = 'altran.musaic.ml';
var mailgun = require('mailgun-js')({
  apiKey: API_KEY,
  domain: DOMAIN,
});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'silva95gustavo@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
};

function send(to, subject, text, callback) {
  var data = {};
  data.from = 'Altran <altran@musaic.ml>';
  data.to = to;
  data.subject = subject;
  data.text = text;
  mailgun.messages().send(data, callback);
};

module.exports = {
  send: send,
};
