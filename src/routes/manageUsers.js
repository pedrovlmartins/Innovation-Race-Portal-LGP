var express = require('express');
var router = express.Router();

//var database = require('database');

router.get('/', function (req, res) {
  database.listAllUsers(function (result) {
    res.render('manageUsers', {
      users: result,
    });
  });

  //res.render('manageUsers');
});

module.exports = router;
