var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var vars = {};
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  res.render('about', vars);
});

module.exports = router;
