const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var vars = irp.getActionResults(req);
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  res.render('index', vars);
  irp.cleanActionResults(req);
});

module.exports = router;
