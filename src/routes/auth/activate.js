var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var router = express.Router();

router.get('/', function (req, res) {
  database.validateAccount(req.query.code, function (err, result) {
    if (err) {
      req.session.errorMessages.push(err);
    } else if (result) {
      req.session.successMessages.push('Email address successfully confirmed.');
    } else {
      req.session.errorMessages.push('Invalid confirmation code.');
    }

    res.redirect('../../');
  });
});

module.exports = router;
