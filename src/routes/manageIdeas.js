var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.get('/', function (req, res) {
  res.render('manageIdeas');
});

module.exports = router;
