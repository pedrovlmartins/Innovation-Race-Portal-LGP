const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var vars = irp.getActionResults(req);
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  res.render('errorPage', vars);
});

module.exports = router;
