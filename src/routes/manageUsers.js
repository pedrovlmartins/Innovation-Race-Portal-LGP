const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.get('/', function (req, res) {
  var vars = irp.getActionResults(req);
  var keyword = req.query.keyword;
  console.log(keyword);

  if (req.query.keyword === undefined) {
    database.listAllUsers(function (result) {
      vars.users = result;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      res.render('manageUsers', vars);
    });
  } else {
    database.searchUsers(keyword, function (error, result) {
      vars.users = result;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      console.log(vars.users);
      res.render('manageUsers', vars);
    });
  }
});

module.exports = router;
