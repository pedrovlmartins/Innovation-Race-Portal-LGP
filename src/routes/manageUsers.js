const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require(path.join(__base, 'database', 'database'));

const itemsPerPage = 10;

router.get('/', function (req, res) {
  var vars = irp.getActionResults(req);
  var keyword = req.query.keyword;
  var offset;
  var page;

  if (req.query.page === undefined) {
    offset = 0;
    page = 1;
  } else {
    page = parseInt(req.query.page);
    if (isNaN(page)) {
      offset = 0;
      page = 1;
    } else if (page < 1) {
      offset = 0;
      page = 1;
    } else offset = (page - 1) * itemsPerPage;
  }

  vars.page = page;

  if (req.query.keyword === undefined) {
    database.getUsersCount(function (result) {
      var numberOfUsers = result[0].count;
      vars.totalPages = Math.floor(numberOfUsers / itemsPerPage);
      if (numberOfUsers % itemsPerPage > 0)
        vars.totalPages += 1;
      database.listUsers(offset, itemsPerPage, function (result) {
        vars.users = result;
        if (req.session.userID !== undefined)
          vars.userID = req.session.userID;
        res.render('manageUsers', vars);
      });
    });
  } else {
    database.searchUsers(keyword, offset, itemsPerPage, function (error, result) {
      var numberOfUsers = result.length;
      vars.keyword = keyword;
      vars.totalPages = Math.floor(numberOfUsers / itemsPerPage);
      vars.users = result;
      if (numberOfUsers % itemsPerPage > 0)
        vars.totalPages += 1;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      res.render('manageUsers', vars);
    });
  }
});

module.exports = router;
