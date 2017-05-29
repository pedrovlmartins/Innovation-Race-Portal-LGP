var express = require('express');
const path = require('path');
const config = require(path.join(__base, 'config'));
const crypto = require('crypto');
var database = require(path.join(__base, 'database', 'database'));
var email = require(path.join(__base, 'lib', 'mailer'));
var EmailTemplate = require('email-templates').EmailTemplate;
const irp = require(path.join(__base, 'lib', 'irp'));
var passwordHashAndSalt = require('password-hash-and-salt');
var users = require(path.join(__base, 'lib', 'users'));
var router = express.Router();

var activationEmailTemplateDir = path.join(__base, 'views', 'emails', 'activation');

router.post('/', function (req, res, next) {
  validate(req);
  req.Validator.getErrors(function (errors) {
    if (errors.length == 0) {
      database.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
          console.error(err);
          irp.addError(req, err);
          res.redirect('../../');
          irp.cleanActionResults(req);
        } else if (user) {
          irp.addError(req, 'An account already exists with the email address "' +
            user.email + '".');
          res.redirect('../../');
          irp.cleanActionResults(req);
        } else {
          // Creating hash and salt
          passwordHashAndSalt(req.body.password).hash(function (error, passwordHash) {
            if (error) {
              console.error(err);
              irp.addError(req, error);
              res.redirect('../../');
              irp.cleanActionResults(req);
            }

            var emailConfirmationToken = crypto.randomBytes(32).toString('hex');
            database.createUser(req.body.name, req.body.email, passwordHash, req.body.type,
              req.body.businessField, req.body.collaboratorNum, req.body.role, emailConfirmationToken,
              function (err) {
                if (err) {
                  console.error(err);
                  irp.addError(req, err);
                  res.redirect('../../');
                  irp.cleanActionResults(req);
                } else {
                  sendActivationEmail(req.body.email, emailConfirmationToken, function (err) {
                    if (err) {
                      console.error(err);
                      irp.addError(req, err);
                    } else {
                      irp.addSuccess(req, 'Account successfully created. Please check your email to validate your account.');
                    }

                    res.redirect('../../');
                    irp.cleanActionResults(req);
                  });
                }
              });
          });
        }
      });
    } else {
      errors.forEach(function (item, index) {
        irp.addError(req, item);
      });

      res.redirect('../../');
      irp.cleanActionResults(req);
    }
  });
});

router.post('/createAdmin', function (req, res) {
  validateAdmin(req);
  req.Validator.getErrors(function (errors) {
    if (errors.length == 0) {
      database.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
          console.error(err);
          irp.addError(req, err);
          res.redirect('../../');
          irp.cleanActionResults(req);
        } else if (user) {
          irp.addError(req, 'An account already exists with the email address "' +
            user.email + '".');
          res.redirect('../../');
          irp.cleanActionResults(req);
        } else {
          // Creating hash and salt
          passwordHashAndSalt(req.body.password).hash(function (error, passwordHash) {
            if (error) {
              console.error(err);
              irp.addError(req, error);
              res.redirect('../../');
              irp.cleanActionResults(req);
            }

            var emailConfirmationToken = crypto.randomBytes(32).toString('hex');
            database.createAdmin(req.body.name, req.body.email, passwordHash, req.body.type,
              emailConfirmationToken,
              function (err) {
                if (err) {
                  console.error(err);
                  irp.addError(req, err);
                  res.redirect('../../');
                  irp.cleanActionResults(req);
                } else {
                  sendActivationEmail(req.body.email, emailConfirmationToken, function (err) {
                    if (err) {
                      console.error(err);
                      irp.addError(req, err);
                    } else {
                      irp.addSuccess(req, 'Account successfully created. Please check your email to validate your account.');
                    }

                    res.redirect('../../');
                    irp.cleanActionResults(req);
                  });
                }
              });
          });
        }
      });
    } else {
      errors.forEach(function (item, index) {
        irp.addError(req, item);
      });

      res.redirect('../../');
      irp.cleanActionResults(req);
    }
  });

});

var validateAdmin = function (req) {
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
        min: 4,
        max: 7,
      },
    });
};

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
        min: 1,
        max: 3,
      },
    });

  if (req.body.type === users.types.CLIENT || req.body.type === users.types.PARTNER) {
    // Client/Partner
    req.Validator.validate('referral', 'Referência');
  } else if (req.body.type === users.types.ALTRAN_MEMBER) {
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
    activationURL: config.baseURL + 'auth/activate?code=' + token,
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
