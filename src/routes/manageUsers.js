const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.get('/', function (req, res) {
  database.listAllUsers(function (result) {
    var vars = irp.getActionResults(req);
    vars.users = result;
    if (req.session.userID !== undefined)
      vars.userID = req.session.userID;
    res.render('manageUsers', vars);
  });

  //res.render('manageUsers');
});

module.exports = router;
