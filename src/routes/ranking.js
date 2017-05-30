const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require('../database/database');
var ideas = require(path.join(__base, 'lib', 'ideas'));

const itemsPerPage = 10;

router.get('/', function (req, res) {
  var vars = irp.getGlobalTemplateVariables(req);
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

  database.getRankingIdeaCount(function (result) {
    var numberOfIdeas = result[0].count;
    vars.totalPages = Math.floor(numberOfIdeas / itemsPerPage);
    if (numberOfIdeas % itemsPerPage > 0)
      vars.totalPages += 1;
    database.listIdeasRanking(offset, itemsPerPage, function (result) {
      result.forEach(
        (idea) => idea.state = ideas.getStateName(idea.state, idea.cancelled)
      );
      vars.ideas = result;
      if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
      res.render('ranking', vars);
      irp.cleanActionResults(req);
    });
  });
});

module.exports = router;
