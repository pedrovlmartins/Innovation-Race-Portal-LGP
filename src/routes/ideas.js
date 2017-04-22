var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));

router.post('/:id/validate', function (req, res, next) {
  db.getUserType(req.session.userID, function (type) {
    if (type !== 7) {
      res.sendStatus(403);
    } else {
      var vars = irp.getActionResults(req);
      var id = req.params.id;

      db.updateIdeaState_validate(id, 5, function (result) {
        if (req.session.userID !== undefined)
          vars.userID = req.session.userID;
        res.redirect(req.get('referer'));
      });
    }
  });
});

router.post('/:id/decline', function (req, res, next) {
  db.getUserType(req.session.userID, function (type) {
    if (type !== 7) {
      res.sendStatus(403);
    } else {
      var vars = irp.getActionResults(req);
      var id = req.params.id;

      db.updateIdeaState_decline(id, function (result) {
        if (req.session.userID !== undefined)
          vars.userID = req.session.userID;
        res.redirect(req.get('referer'));
      });
    }
  });
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
              if (type >= 3 || ids.indexOf(req.session.userID) !== -1) {
                var vars = {
                  id: req.params.id,
                  name: ideaInfo.name,
                  leader: ideaInfo.creator,
                  description: ideaInfo.description,
                  resultsToProduce: ideaInfo.resultsToProduce,
                  uncertaintyToSolve: ideaInfo.uncertaintyToSolve,
                  techHumanResources: ideaInfo.techHumanResources,
                  solutionTechnicalCompetence: ideaInfo.solutionTechnicalCompetence,
                  members: members,
                  type: type,
                  ideaState: ideaInfo.state,
                  ideaCancelled: ideaInfo.cancelled,
                };
                console.log('Vars: ');
                console.log(vars.description);
                console.log(vars.ideaState);
                console.log(vars.ideaCancelled);
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

router.get('/submit', function (req, res, next) {
});

module.exports = router;
