const path = require('path');
var express = require('express');
var database = require(path.join(__base, 'database', 'database'));
var router = express.Router();

router.get('/', function (req, res) {
  if (req.session.userID !== undefined) {
    req.session.destroy();
    res.redirect('/');
  }
  else{
    res.sendStatus(401);
  }
});

module.exports = router;
