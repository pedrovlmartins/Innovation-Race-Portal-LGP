const path = require('path');
var express = require('express');
var database = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));
var router = express.Router();

router.get('/', function (req, res) {
  if (req.session.userID !== undefined) {
    req.session.destroy();
  }

  res.redirect('/');
});

module.exports = router;
