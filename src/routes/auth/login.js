var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var passwordHashAndSalt = require('password-hash-and-salt');
var router = express.Router();

router.post('/', function (req, res) {
  database.getUserByEmail(req.body.email, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else if (user) {
      passwordHashAndSalt(req.body.password)
        .verifyAgainst(user.passwordHash, function (error, verified) {
          if (error) {
            res.status(500).send(error);
          } else if (!verified) {
            res.status(403).send("Invalid password for user with email '" + req.body.email + "'.");
          } else {
            if (user.emailConfirmationToken == null) { // E-mail validated
              req.session.userID = user.id;
              res.render('index');
            } else if (user.accountStatus) {
              res.status(403).send('Login successful, but pending e-mail confirmation.' +
                ' Please click the link sent to "' + req.body.email + '".');
            } else {
              res.status(403).send('Login successful, but your account is waiting admin approval.' +
                ' Please be patient.');
            }
          }
        });
    } else {
      res.sendStatus(403).send('No user found with email "' + req.body.email + '".');
    }
  });
});

module.exports = router;
