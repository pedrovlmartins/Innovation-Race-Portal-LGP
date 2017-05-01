var express = require('express');
const path = require('path');
const config = require(path.join(__base, 'config'));
var mailer = require(path.join(__base, 'lib', 'mailer'));
var EmailTemplate = require('email-templates').EmailTemplate;
var router = express.Router();

var contactEmailTemplateDir = path.join(__base, 'views', 'emails', 'contact');

router.post('/', function (req, res) {
  var email = new EmailTemplate(contactEmailTemplateDir);
  var data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  };
  email.render(data, function (err, result) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      mailer.send(config.mail.from, 'Contact message received - Innovation Race Portal',
        result.text, result.html, function (error, info) {
          if (error) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
    }
  });
});

module.exports = router;
