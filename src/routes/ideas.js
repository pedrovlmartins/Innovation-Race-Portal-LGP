var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const ideas = require(path.join(__base, 'lib', 'ideas'));
const irp = require(path.join(__base, 'lib', 'irp'));
const users = require(path.join(__base, 'lib', 'users'));

/*router.post('/:id/validate', function (req, res, next) { // Evaluation
  db.getUserType(req.session.userID, function (type) {
    if (!irp.currentCanEvaluateIdea(req)) {
      irp.addError(req, 'You are not allowed to evaluate an idea.');
      res.redirect('back');
    } else {
      var vars = irp.getActionResults(req);
      var id = req.params.id;

      db.updateIdeaState_validate(id, ideas.states.AWAITING_SELECTION, function (err, result) {
        if (err) {
          irp.addError(req, 'An unknown error occured. The idea was not validated.');
        } else {
          irp.addSuccess(req, 'Idea successfully validated.');
          vars.userID = irp.currentUserID(req);
          db.getIdea(req.params.id, function (ideaInfo) {
            sendEvaluationNotificationEmail(ideaInfo.creatorId, ideaInfo.title, true);
          });
        }

        res.redirect('back');
      });
    }
  });
});

router.post('/:id/decline', function (req, res, next) { // Evaluation
  db.getUserType(req.session.userID, function (type) {
    if (!irp.currentCanEvaluateIdea(req)) {
      res.sendStatus(403);
    } else {
      var vars = irp.getActionResults(req);
      var id = req.params.id;

      db.updateIdeaState_decline(id, function (err, result) {
        if (err) {
          irp.addError(req, 'An unknown error occured. The idea was not declined.');
        } else {
          irp.addSuccess(req, 'Idea successfully declined.');
          vars.userID = irp.currentUserID(req);
          db.getIdea(req.params.id, function (ideaInfo) {
            sendEvaluationNotificationEmail(ideaInfo.creatorId, ideaInfo.title, false);
          });
        }

        res.redirect(req.get('referer'));
      });
    }
  });
});
*/

router.post('/:id/evaluation', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanEvaluateIdea(req)) {
    irp.addError(req, 'Only a R&D Director may may evaluate an idea.');
    res.redirect('back');
    return;
  }

  db.getIdea(req.params.id, function (ideaInfo) {
    if (ideaInfo === undefined) {
      irp.addError(req, 'Could not find idea.');
      res.redirect('back');
      return;
    }

    if (ideaInfo.cancelled[0]) {
      irp.addError(req, 'You cannot evaluate a cancelled idea.');
      res.redirect('back');
      return;
    }

    if (req.body.evaluated === 'true') {
      db.updatedIdeaState_evaluate(req.params.id, function (error, result) {
        if (error) {
          console.error(error);
          irp.addError(req, 'Unknown error occurred, please try again later.');
          res.redirect('back');
          return;
        }

        irp.addSuccess(req, 'The idea has been evaluated sucessfully.');
        res.redirect('back');
        sendCoachingEndNotificationEmail(ideaInfo.creatorId, ideaInfo.title, true);
      });
    } else {
      db.updateIdeaState_decline(req.params.id, function (result) {
        irp.addSuccess(req, 'The idea has been rejected.');
        res.redirect('back');
        sendCoachingEndNotificationEmail(ideaInfo.creatorId, ideaInfo.title, false);
      });
    }
  });
});

router.post('/:id/selection', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanSelectIdea(req)) {
    irp.addError(req, 'Only a member of the R&D committee may select an idea.');
    res.redirect('back');
    return;
  }

  db.getIdea(req.params.id, function (ideaInfo) {
    if (ideaInfo === undefined) {
      irp.addError(req, 'Could not find idea.');
      res.redirect('back');
      return;
    }

    if (ideaInfo.cancelled[0]) {
      irp.addError(req, 'You cannot select a cancelled idea.');
      res.redirect('back');
      return;
    }

    if (req.body.selected === 'true') {
      db.updatedIdeaState_select(req.params.id, function (error, result) {
        if (error) {
          console.error(error);
          irp.addError(req, 'Unknown error occurred, please try again later.');
          res.redirect('back');
          return;
        }

        irp.addSuccess(req, 'The idea has been selected to advance to the coaching phase.');
        res.redirect('back');
        sendSelectionNotificationEmail(ideaInfo.creatorId, ideaInfo.title, true);
      });
    } else {
      db.updateIdeaState_decline(req.params.id, function (result) {
        irp.addSuccess(req, 'The idea has been rejected.');
        res.redirect('back');
        sendSelectionNotificationEmail(ideaInfo.creatorId, ideaInfo.title, false);
      });
    }
  });
});

/*
router.post('/:id/commissionDecline', function (req, res, next) {
  db.getUserType(req.session.userID, function (type) {
    if (type !== 4) {
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
*/

/*
router.post('/:id/select', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
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
*/

/* R&D Manager Permission to go or not to next phase (Kick-Off) */
router.post('/:id/goKickOff', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanGoIdea(req)) {
    irp.addError(req, 'Only a R&D Manager may set an idea to be implemented.');
    res.redirect('back');
    return;
  }

  db.getIdea(req.params.id, function (ideaInfo) {
    if (ideaInfo === undefined) {
      irp.addError(req, 'Could not find idea.');
      res.redirect('back');
      return;
    }

    if (ideaInfo.cancelled[0]) {
      irp.addError(req, 'You cannot set to implement a cancelled idea.');
      res.redirect('back');
      return;
    }

    if (req.body.goKickOff === 'true') {
      db.updatedIdeaState_go(req.params.id, function (error, result) {
        if (error) {
          console.error(error);
          irp.addError(req, 'Unknown error occurred, please try again later.');
          res.redirect('back');
          return;
        }

        irp.addSuccess(req, 'The idea has been selected to advance to the implementation phase.');
        res.redirect('back');
        sendCoachingEndNotificationEmail(ideaInfo.creatorId, ideaInfo.title, true);
      });
    } else {
      db.updateIdeaState_decline(req.params.id, function (result) {
        irp.addSuccess(req, 'The idea has been rejected.');
        res.redirect('back');
        sendCoachingEndNotificationEmail(ideaInfo.creatorId, ideaInfo.title, false);
      });
    }
  });
});

router.post('/:id/bmc', function (req, res) {
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
        db.updatedIdeaState_coaching(req.params.id, function (error, result) {
          if (error) {
            console.error(error);
            irp.addError(req, 'Unknown error occurred, please try again later.');
            res.redirect('back');
            return;
          }

          irp.addSuccess(req, 'The idea is now waiting for GO / NO GO after the coaching!');
          res.redirect('back');
        });
      }
    }
  );
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
                  ideaCancelled: ideaInfo.cancelled,
                  canEvaluateIdea: !ideaInfo.cancelled
                    && ideaInfo.state == ideas.states.AWAITING_EVALUATION
                    && irp.currentCanEvaluateIdea(req),
                  canSelectIdea: !ideaInfo.cancelled
                    && ideaInfo.state === ideas.states.AWAITING_SELECTION
                    && irp.currentCanSelectIdea(req),
                  canCoachIdea: !ideaInfo.cancelled
                    && ideaInfo.state === ideas.states.IN_COACHING_PHASE,
                  canGoKickOffIdea: !ideaInfo.cancelled
                  && ideaInfo.state === ideas.states.AWAITING_GO_NO_GO
                  && irp.currentCanSelectIdea(req),
                };
                if (req.session.userID !== undefined)
                  vars.userID = req.session.userID;

                res.render('idea', irp.mergeRecursive(vars, irp.getActionResults(req)));
                irp.cleanActionResults(req);
              } else
                res.sendStatus(403);
            }
          });
        });
      }
    });
  }
});

function sendEvaluationNotificationEmail(creatorID, title, approved) {
  db.getUserEmail(creatorID, function (err, email) {
    if (err) {
      console.error(err);
    } else {
      ideas.sendEvaluationNotificationEmail(email, title, approved, function (error, body) {
        if (error)
          console.error(error);
      });
    }
  });
}

function sendSelectionNotificationEmail(creatorID, title, selected) {
  db.getUserEmail(creatorID, function (err, email) {
    if (err) {
      console.error(err);
    } else {
      ideas.sendSelectionNotificationEmail(email, title, selected, function (error, body) {
        if (error)
          console.error(error);
      });
    }
  });
}

function sendCoachingEndNotificationEmail(creatorID, title, go) {
  db.getUserEmail(creatorID, function (err, email) {
    if (err) {
      console.error(err);
    } else {
      ideas.sendCoachingEndNotificationEmail(email, title, go, function (error, body) {
        if (error)
          console.error(error);
      });
    }
  });
}

module.exports = router;
