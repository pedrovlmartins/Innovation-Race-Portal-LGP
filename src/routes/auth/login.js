var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var passwordHashAndSalt = require('password-hash-and-salt');
var router = express.Router();

router.post('/', function (req, res) {
  database.getUserByEmail(req.body.email, function (err, user) {
    if (err) {
      res.errorMessages.push(err);
      res.redirect('../../');
    } else if (user) {
      passwordHashAndSalt(req.body.password)
        .verifyAgainst(user.passwordHash, function (error, verified) {
          if (error) {
            res.status(500).send(error);
          } else if (!verified) {
            req.session.errorMessages.push('Invalid password for user with email "' +
              req.body.email + '".');
          } else {
            if (user.emailConfirmationToken == null) { // E-mail validated
              req.session.userID = user.id;
              res.redirect('../');
            } else if (user.accountStatus) {
              req.errorMessages.push('Login successful, but pending e-mail confirmation.' +
                ' Please click the link sent to "' + req.body.email + '".');
            } else {
              req.errorMessages.push('Login successful, but your account is waiting admin approval.' +
                ' Please be patient.');
            }
          }

          res.redirect('../../');
        });
    } else {
      req.errorMessages.push('No user found with email "' + req.body.email + '".');
      res.redirect('../../');
    }
  });
});

module.exports = router;
