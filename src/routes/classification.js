var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var vars = {};
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  res.render('classification', vars);
});

module.exports = router;
