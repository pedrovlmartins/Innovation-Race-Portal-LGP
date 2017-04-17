var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));

router.get('/submit', function (req, res) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  res.render('submitIdea', irp.getActionResults(req));
  irp.cleanActionResults(req);
});

router.post('/submit', function (req, res) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentIsParticipant(req)) {
    irp.addError(req, 'You are not allowed to submit new ideas.');
    res.redirect('../');
    return;
  }

  res.send(501);
  irp.cleanActionResults(req);
});

router.get('/:id', function (req, res) {
  var ids = [];
  if (req.session.userID === undefined)
    res.sendStatus(401);
  else {
    db.getIdea(req.params.id, function (ideaInfo) {
      if (ideaInfo === undefined)
        res.sendStatus(404);
      else {
        db.getUserType(req.session.userID, function (type) {
          db.getTeamMembers(req.params.id, function (members) {
            ids = members.map((member) => {
                member.id;
              });
            ids.push(ideaInfo.creatorId);
            if (req.session !== undefined) {
              if (type === 3 || ids.indexOf(req.session.userID) !== -1) {
                var vars = {
                  name: ideaInfo.name,
                  leader: ideaInfo.creator,
                  description: ideaInfo.description,
                  resultsToProduce: ideaInfo.resultsToProduce,
                  uncertaintyToSolve: ideaInfo.uncertaintyToSolve,
                  techHumanResources: ideaInfo.techHumanResources,
                  solutionTechnicalCompetence: ideaInfo.solutionTechnicalCompetence,
                  members: members,
                };
                if (req.session.userID !== undefined)
                  vars.userID = req.session.userID;
                res.render('idea', vars);
              } else
                res.sendStatus(403);
            }
          });
        });
      }
    });
  }
});

module.exports = router;
