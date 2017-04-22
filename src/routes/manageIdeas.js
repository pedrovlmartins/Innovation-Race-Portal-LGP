const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require('../database/database');
var ideas = require(path.join(__base, 'lib', 'ideas'));

const itemsPerPage = 10;

router.get('/', function (req, res) {
  database.getUserType(req.session.userID, function (type) {
    if (type < 3) {
      res.sendStatus(403);
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
        database.getIdeaCount(function (result) {
          var numberOfIdeas = result[0].count;
          vars.totalPages = Math.floor(numberOfIdeas / itemsPerPage);
          if (numberOfIdeas % itemsPerPage > 0)
            vars.totalPages += 1;
          database.listIdeas(offset, itemsPerPage, function (result) {
            result.forEach(
              (idea) => idea.state = ideas.getStateName(idea.state)
            );
            vars.ideas = result;
            if (req.session.userID !== undefined)
              vars.userID = req.session.userID;
            res.render('manageIdeas', vars);
          });
        });
      } else {
        database.searchIdeas(keyword, offset, itemsPerPage, function (error, result) {
          var numberOfIdeas = result.length;
          vars.keyword = keyword;
          vars.totalPages = Math.floor(numberOfIdeas / itemsPerPage);
          result.forEach(
            (idea) => idea.state = ideas.getStateName(idea.state)
          );
          vars.ideas = result;
          if (numberOfIdeas % itemsPerPage > 0)
            vars.totalPages += 1;
          if (req.session.userID !== undefined)
            vars.userID = req.session.userID;
          res.render('manageIdeas', vars);
        });
      }
    }
  });
});

module.exports = router;
