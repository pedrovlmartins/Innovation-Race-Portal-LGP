var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const irp = require(path.join(__base, 'lib', 'irp'));

router.post('/:id/validate', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError('You are not logged in.');
    res.redirect('../../');
    return;
  }

  db.getUserType(req.session.userID, function (type) {
    if (type !== 7) {
      res.sendStatus(403);
    } else {
      var vars = irp.getActionResults(req);
      var id = req.params.id;

      db.updateIdeaState_validate(id, 4, function (result) {
        if (req.session.userID !== undefined)
          vars.userID = req.session.userID;
        res.redirect(req.get('referer'));
      });
    }
  });
});

router.post('/:id/decline', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError('You are not logged in.');
    res.redirect('../../');
    return;
  }

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

router.post('/:id/commissionDecline', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError('You are not logged in.');
    res.redirect('../../');
    return;
  }

  db.getUserType(req.session.userID, function (type) {
    if (type !== 5) {
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

router.post('/:id/select', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError('You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanSelectIdea(req)) {
    irp.addError(req, 'Only a member of the R&D committee may select an idea.');
    res.redirect('back');
    return;
  }

  db.updatedIdeaState_select(req.params.id, function (error, result) {
    if (error) {
      console.error(error);
      irp.addError(req, 'Unknown error occurred, please try again later.');
      res.redirect('back');
      return;
    }

    irp.addSuccess(req, 'The idea has been selected to advance to the coaching phase.');
    res.redirect('back');
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
            ids = members.map(function (member) {
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
                  ideaCancelled: ideaInfo.cancelled[0],
                };
                console.log('Vars: ');
                console.log('descrição - ' + vars.description);
                console.log('estado - ' + vars.ideaState);
                console.log('ideia cancelada - ', vars.ideaCancelled);
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
