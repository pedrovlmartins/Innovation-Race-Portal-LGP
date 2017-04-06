var express = require('express');
const path = require('path');
const crypto = require('crypto');
var database = require(path.join(__base, 'database', 'database'));
var email = require(path.join(__base, 'lib', 'mailer'));
var EmailTemplate = require('email-templates').EmailTemplate;
var passwordHashAndSalt = require('password-hash-and-salt');
var router = express.Router();

var activationEmailTemplateDir = path.join(__base, 'views', 'emails', 'activation');

router.post('/', function (req, res) {
  validate(req);
  req.Validator.getErrors(function (errors) {
    if (errors.length == 0) {
      database.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else if (user) {
          res.status(403).send('An account already exists with the email address "' + user.email + '".');
        } else {
          // Creating hash and salt
          passwordHashAndSalt(req.body.password).hash(function(error, passwordHash) {
            if (error)
              throw new Error('Something went wrong!');

            var emailConfirmationToken = crypto.randomBytes(32).toString('hex');
            database.createUser(req.body.name, req.body.email, passwordHash, req.body.type,
              req.body.businessField, req.body.collaboratorNum, req.body.role, emailConfirmationToken,
              function (err) {
                if (err) {
                  console.log(err);
                  res.status(500).send(err);
                } else {
                  sendActivationEmail(req.body.email, emailConfirmationToken, function(err) {
                    if (err) {
                      console.log(err);
                      res.status(500).send(err);
                    } else {
                      res.send('Account successfully created');
                    }
                  });
                }
              });
          });
        }
      });
    } else {
      res.send(403, errors.join('\n'));

      //res.redirect('../');
    }
  });
});

var validate = function (req) {
  // Documentation for the form validator: https://www.npmjs.com/package/form-validate
  req.Validator.validate('name', 'Name', {
    required: true,
    length: {
      min: 3,
      max: 200,
    },
  })
    .filter('name', {
      trim: true,
    })
    .validate('email', 'Email', {
      required: true,
      email: true,
    })
    .filter('email', {
      trim: true,
    })
    .validate('password', 'Password', {
      required: true,
      length: {
        min: 7,
      },
    })
    .filter('password', {
      stripTags: false,
      escapeHTML: false,
    })
    .validate('type', 'Account type', {
      required: true,
      between: {
        min: 0,
        max: 2,
      },
    });

  if (req.body.type === 0 || req.body.type === 1) {
    // Client/Partner
    req.Validator.validate('referral', 'Referência');
  } else if (req.body.type === 2) {
    // Altran Member
    req.Validator.validate('businessField', 'Business Field', {
      required: true,
      length: {
        min: 1,
        max: 200,
      },
    })
      .validate('colaboratorNum', 'Colaborator Number', {
        required: true,
        integer: {
          allowNegative: false,
        },
      })
      .validate('role', 'Role', {
        required: false,
        length: {
          max: 200,
        },
      });
  }
};

var sendActivationEmail = function (to, token, callback) {
  var newsletter = new EmailTemplate(activationEmailTemplateDir);
  var user = {
    activationCode: token,
    activationURL: 'http://localhost:8080/auth/activate?code=' + token,
    replyTo: 'altran@musaic.ml',
  };
  newsletter.render(user, function (err, result) {
    if (err) console.error(err);
    email.send(to, 'Innovation Race Portal - Email confirmation required', result.text, result.html,
      function (error, body) {
      callback(error, body);
    });
  });
};

module.exports = router;
