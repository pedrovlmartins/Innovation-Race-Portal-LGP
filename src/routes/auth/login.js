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
            req.session.userID = user.id;
            res.render('index');
          }
        });
    } else {
      res.sendStatus(403).send("No user found with email '" + req.body.email + "'.");
    }
  });
});

module.exports = router;
