var express = require('express');
const path = require('path');
var database = require(path.join(__dirname, '../', '../', 'database', 'database'));
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

  /*
   * Call the "getErrors" method to start the validation
   */
  req.Validator.getErrors(function (errors) {
    /*
     * ... Your further rendering logic. e.g. res.render('view', { errors: errors });
     */

    // TODO
    if (errors.length == 0) {
      database.createUser(req.body.name, req.body.email, req.body.password, req.body.type,
        req.body.businessField, req.body.collaboratorNum, req.body.role, function (err) {
          if (err) {
            res.send(500, err);
          } else {
            res.sendStatus(200);
          }
        });
    } else {
      res.send(403, errors.join('\n'));

      //res.render('index', { errors: errors });
    }
  });
});

module.exports = router;
