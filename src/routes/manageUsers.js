const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require(path.join(__base, 'database', 'database'));
var users = require(path.join(__base, 'lib', 'users'));

const itemsPerPage = 10.0;

router.get('/', function (req, res) {
  database.getUserType(req.session.userID, function (type) {
    if (!users.isAdmin(type)) {
      irp.addError(req, 'You are not an Administrator');
      res.redirect('back');
    } else {
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
          vars.totalPages = Math.ceil(numberOfUsers / itemsPerPage);
          database.listUsers(offset, itemsPerPage, function (result) {
            result.forEach(
              (user) => user.type = users.getTypeDescription(user.type)
            );
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
          vars.totalPages = Math.ceil(numberOfUsers / itemsPerPage);
          result.forEach(
            (user) => user.type = users.getTypeDescription(user.type)
          );
          vars.users = result;
          if (req.session.userID !== undefined)
            vars.userID = req.session.userID;
          res.render('manageUsers', vars);
        });
      }
    }
  });
});

module.exports = router;
