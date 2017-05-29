var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const ideas = require(path.join(__base, 'lib', 'ideas'));
const irp = require(path.join(__base, 'lib', 'irp'));
const users = require(path.join(__base, 'lib', 'users'));

router.post('/:id/evaluation', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanEvaluateIdea(req)) {
    irp.addError(req, 'Only a R&D Director may evaluate an idea.');
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

router.post('/:id/evaluationScore', function (req, res, next) {
  if (!irp.currentUserID(req)) {
    irp.addError(req, 'You are not logged in.');
    res.redirect('../../');
    return;
  }

  if (!irp.currentCanEvaluateIdea(req)) {
    irp.addError(req, 'Only a R&D Director may evaluate and score the idea.');
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
      irp.addError(req, 'You cannot set the score to a cancelled idea.');
      res.redirect('back');
      return;
    }

    db.updatedIdeaScore(req.params.id, req.body.scoreNumber, function (error, result) {
      if (error) {
        console.error(error);
        irp.addError(req, 'Unknown error occurred, please try again later.');
        res.redirect('back');
        return;
      }
      irp.addSuccess(req, 'The score has been updated sucessfully.');
      res.redirect('back');
    });
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
  if (req.session.userID === undefined) {
    irp.addError(req, 'You need to be logged in to see ideas info.');
    res.redirect('back');
  } else {
    db.getIdea(req.params.id, function (ideaInfo) {
      if (ideaInfo === undefined)
        res.sendStatus(404);
      else {
        db.getUserType(req.session.userID, function (type) {
            if (req.session !== undefined) {
              if (type >= 3 || req.session.userID !== -1) {
                var vars = {
                  id: req.params.id,
                  name: ideaInfo.title,
                  leader: ideaInfo.creator,
                  description: ideaInfo.description,
                  score: ideaInfo.score,
                  state: ideaInfo.state,
                  resultsToProduce: ideaInfo.resultsToProduce,
                  uncertaintyToSolve: ideaInfo.uncertaintyToSolve,
                  techHumanResources: ideaInfo.techHumanResources,
                  solutionTechnicalCompetence: ideaInfo.solutionTechnicalCompetence,
                  type: type,
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

                if (ideaInfo.state == 1)
                    vars.ideaState = 'This idea is still in the drafting stages.';
                else if (ideaInfo.state == 1)
                  vars.ideaState = 'The idea is waiting to be classified.';
                else if (ideaInfo.state == 2)
                    vars.ideaState = 'At the present moment, this idea is being classified.';
                else if (ideaInfo.state == 3)
                    vars.ideaState = 'The idea is waiting to be evaluated.';
                else if (ideaInfo.state == 4)
                    vars.ideaState = 'The idea is waiting to be selected.';
                else if (ideaInfo.state == 5)
                    vars.ideaState = 'The idea has been selected (PA REMOVER).';
                else if (ideaInfo.state == 6)
                    vars.ideaState = 'The idea is in the coaching phase, waiting for the BMC to be analyzed.';
                else if (ideaInfo.state == 7)
                    vars.ideaState = 'The idea is waiting for the green light (GO) or the red light (NO GO) in order to be implemented.';
                else if (ideaInfo.state == 8)
                    vars.ideaState = 'The idea is being implemented.';
                else if (ideaInfo.state == -1)
                    vars.ideaState = 'The idea has been canceled';


                if (req.session.userID !== undefined)
                  vars.userID = req.session.userID;

                res.render('idea', irp.mergeRecursive(vars, irp.getGlobalTemplateVariables(req)));
                irp.cleanActionResults(req);
              } else
                res.sendStatus(404);
            }
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
