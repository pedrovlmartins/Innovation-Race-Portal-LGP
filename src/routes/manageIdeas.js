var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.get('/', function (req, res) {
  database.listAllIdeas(function (result) {
    res.render('manageIdeas', {
      ideas: result,
    });
  });

  //res.render('manageIdeas');
});

module.exports = router;
