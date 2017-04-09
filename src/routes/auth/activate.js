var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));
var router = express.Router();

router.get('/', function (req, res, next) {
  database.validateAccount(req.query.code, function (err, result) {
    if (err) {
      irp.addError(req, err);
    } else if (result) {
      irp.addSuccess(req, 'Email address successfully confirmed.');
    } else {
      irp.addError(req, 'Invalid confirmation code.');
    }

    res.redirect('../../');
    irp.cleanActionResults(req);
  });
});

module.exports = router;
