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
    database.listAllIdeas(function (result) {
      vars.ideas = result;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      res.render('manageIdeas', vars);
    });
  } else {
    database.searchIdeas(keyword, function (error, result) {
      vars.ideas = result;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      res.render('manageIdeas', vars);
    });
  }
});

module.exports = router;
