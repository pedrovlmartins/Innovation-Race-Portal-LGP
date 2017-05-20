var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var passwordHashAndSalt = require('password-hash-and-salt');
const irp = require(path.join(__base, 'lib', 'irp'));
var router = express.Router();
var users = require(path.join(__base, 'lib', 'users'));


router.post('/', function (req, res, next) {
  database.getUserByEmail(req.body.email, function (err, user) {
    if (err) {
      irp.addError(req, 'Unknown error occurred, please try again later.');
      res.redirect('../../');
    } else if (user) {
      passwordHashAndSalt(req.body.password)
        .verifyAgainst(user.passwordHash, function (error, verified) {
          if (error) {
            irp.addError(req, error);
          } else if (!verified) {
            irp.addError(req, 'Invalid password for user with email "' +
              req.body.email + '".');
          } else if(user.blocked) {
              irp.addError(req, 'Login unsuccessful, account blocked.');
          }
          else if(!users.isAdmin(user.type) && !user.confirmed) {
              irp.addError(req, 'Login unsuccessful, waiting Admin confirmation.');
          }
          else {
            if (user.emailConfirmationToken == null) { // E-mail validated
              req.session.userID = user.id;
              req.session.userType = user.type;
              irp.addSuccess(req, 'Login successful, welcome!');
            } else if (user.accountStatus) {
              irp.addError(req, 'Login successful, but pending e-mail confirmation.' +
                ' Please click the link sent to "' + req.body.email + '".');
            } else {
              irp.addError(req, 'Login successful, but your account is waiting admin approval.' +
                ' Please be patient.');
            }
          }

          res.redirect('../../');
        });
    } else {
      irp.addError(req, 'No user found with email "' + req.body.email + '".');
      res.redirect('../../');
    }
  });
});

module.exports = router;
