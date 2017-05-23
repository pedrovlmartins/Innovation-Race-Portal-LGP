var express = require('express');
var router = express.Router();
const path = require('path');
const db = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));
const users = require(path.join(__base, 'lib', 'users'));

router.get('/', function(req, res) {
    var vars = irp.getActionResults(req);
    if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
    res.render('bmc', vars);
  });

module.exports = router;

router.post('/', function (req, res) {
    /*if (!users.isParticipant(irp.currentUserType(req))) {
      irp.addError(req, 'You must be a participant in the contest in order to fill the BMC.');
      res.redirect('back');
      return;
    }*/

  db.insertBMC(req.params.id, req.body.keyPartners, req.body.keyActivities,
        req.body.keyResources, req.body.valuePropositions,
        req.body.costumerSegments, req.body.costumerRelationships,
        req.body.channels, req.body.costStructure, req.body.revenueStreams,
        function (err) {
            if (err) {
              console.error(err);
              irp.addError(req, err);
              res.redirect('../../');
              irp.cleanActionResults(req);
            } else {
              res.redirect(req.get('referer'));
            }
          }
          );
  });

module.exports = router;

