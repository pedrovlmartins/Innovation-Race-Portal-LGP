const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();
var database = require('../database/database');
var ideas = require(path.join(__base, 'lib', 'ideas'));
var races = require(path.join(__base, 'lib', 'races'));
var users = require(path.join(__base, 'lib', 'users'));

const itemsPerPage = 10.0;

router.get('/', function (req, res) {
  database.getUserType(req.session.userID, function (type) {
    if (!users.isAdmin(type)) {
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

      database.getRaceCount(function (result) {
        var numberOfRaces = result[0].count;
        vars.totalPages = Math.ceil(numberOfRaces / itemsPerPage);
        database.listRaces(offset, itemsPerPage, function (result) {
          var currentDate = new Date();
          result.forEach(function (race) {
            race.phase = races.getPhaseDescription(
              races.getPhase(race.phase1Start, race.phase2Start,
              race.phase3Start, race.phase4Start, race.phase4End));
          });

          vars.races = result;
          vars.currentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
            .toISOString().substring(0, 19);
          if (req.session.userID !== undefined)
            vars.userID = req.session.userID;
          res.render('manageRaces', vars);
          irp.cleanActionResults(req);
        });
      });
    }
  });
});

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

module.exports = router;
