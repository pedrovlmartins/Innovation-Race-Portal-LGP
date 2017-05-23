const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
const users = require(path.join(__base, 'lib', 'users'));
var router = express.Router();

router.get('/', function (req, res, next) {
  var vars = irp.getActionResults(req);
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  vars.userTypes = users.types;
  res.render('index', vars);
  irp.cleanActionResults(req);
});

module.exports = router;
