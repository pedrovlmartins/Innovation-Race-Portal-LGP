var express = require('express');
const path = require('path');
const crypto = require('crypto');
var database = require(path.join(__dirname, '../', '../', 'database', 'database'));
var email = require(path.join(__dirname, '../', '../', 'lib', 'email'));
var passwordHashAndSalt = require('password-hash-and-salt');
var router = express.Router();

router.post('/', function (req, res) {

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

  req.Validator.getErrors(function (errors) {
    if (errors.length == 0) {
      // Creating hash and salt
      passwordHashAndSalt(req.body.password).hash(function (error, passwordHash) {
        if (error)
          throw new Error('Something went wrong!');

        var emailConfirmationToken = crypto.randomBytes(32).toString('hex');
        database.createUser(req.body.name, req.body.email, passwordHash, req.body.type,
          req.body.businessField, req.body.collaboratorNum, req.body.role, emailConfirmationToken,
          function (err) {
            if (err) {
              res.send(500, err);
            } else {
              sendActivationEmail(req.body.email, emailConfirmationToken);
              res.sendStatus(200);
            }
          });
      });
    } else {
      res.send(403, errors.join('\n'));

      //res.render('index', { errors: errors });
    }
  });
});

var sendActivationEmail = function (to, token) {
  email.send(to, 'Hello',
    'Activate your account by clicking the following URL: ' + token,
    function (error, body) {
    console.log('AA', error, body);
  });
};

module.exports = router;
