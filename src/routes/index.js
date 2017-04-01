var express = require('express');
var path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
