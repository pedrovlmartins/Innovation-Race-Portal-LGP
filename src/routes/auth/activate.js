var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var router = express.Router();

router.get('/', function (req, res) {
  database.validateAccount(req.query.code, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else if (result) {
      res.send('Email address successfully confirmed.');
    } else {
      res.send('Invalid confirmation code.');
    }
  });
});

module.exports = router;
