var express = require('express');
var router = express.Router();
const path = require('path');
const db = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));

router.get('/', function (req, res) {
  var vars = {};
  if (req.session.userID !== undefined)
    vars.userID = req.session.userID;
  res.render('classification', vars);
});

router.post('/', function (req, res) {
  if (!irp.currentIsManager(req)) {
    irp.addError(req, 'You are not a I&D manager.');
    res.redirect('back');
    return;
  }

  db.classifyIdea(req.body.ideaID, req.body.strategyAlignment, req.body.offerType,
    req.body.market, req.body.technicalVialibity, req.body.economicalViability, req.body.riskFactors,
    req.body.otherRequirements, function (error, results) {
      if (error) {
        irp.addError(req, 'Unknown error occurred.');
      } else if (results.affectedRows == 0) {
        irp.addError(req, 'Could not classify idea.');
      } else {
        irp.addSuccess(req, 'Idea successfully classified.');
      }

      res.redirect('back');
      return;
    });
});

module.exports = router;
