var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
const ideas = require(path.join(__base, 'lib', 'ideas'));
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

  validateSubmitIdea(req);
  req.Validator.getErrors(function (errors) {
    if (errors.length == 0) {
      db.getActiveRaces(function (err, races) {
        if (races.length == 0) {
          irp.addError(req, 'You cannot submit a new idea because there is no active race.');
          res.redirect('back');
          return;
        }

        var race = races[0].id;
        db.createIdea(irp.currentUserID(req), race, req.body.title, req.body.description,
          req.body.uncertaintyToSolve, req.body.solutionTechnicalCompetence,
          req.body.techHumanResources, req.body.resultsToProduce,
          function (err, id) {
            if (err) {
              console.error(err);
              irp.addError(req, err);
              res.redirect('back');
            } else {
              irp.addSuccess(req, 'Idea successfully created.');
              res.redirect(id);
              irp.cleanActionResults(req);
            }
          });
      });
    } else {
      errors.forEach(function (item, index) {
        irp.addError(req, item);
      });

      res.redirect('back');
    }
  });
});

router.post('/draft', function (req, res) {
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

  db.saveDraft(req.session.userID, req.body.ideaTitle, req.body.description, req.body.teamIdea, req.body.teammembers,
      req.body.uncertaintyToSolve, req.body.solutionTechnicalCompetence, req.body.techHumanResources,
      req.body.results, function(err) {
        if (err) {
          console.error(err);
          irp.addError(req, err);
          res.redirect('back');
        } else {
          irp.addSuccess(req, 'Idea draft successfully saved.');
          res.redirect('back');
          irp.cleanActionResults(req);
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
            /*ids = members.map((member) => {
                member.id;
              });*/
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

var validateSubmitIdea = function (req) {
  // Documentation for the form validator: https://www.npmjs.com/package/form-validate
  req.Validator.validate('title', 'Title', {
    required: true,
    length: {
      min: 3,
      max: 1000,
    },
  })
    .filter('title', {
      trim: true,
    })
    .validate('description', 'Description', {
      required: true,
      length: {
        min: 3,
      },
    })
    .validate('uncertaintyToSolve',
      'Scientific/Technological uncertainty that the project aims to solve', {
        required: true,
        length: {
          min: 3,
        },
      })
    .validate('solutionTechnicalCompetence',
      'Why can\'t the solutions found be implemented by' +
      'someone with technical skills in the field?', {
        required: true,
        length: {
          min: 3,
        },
      })
    .validate('techHumanResources', 'Humand and technological resources needed', {
      required: true,
      length: {
        min: 3,
      },
    })
    .validate('resultsToProduce', 'Results to be produced by the project', {
      required: true,
      length: {
        min: 3,
      },
    });
};

module.exports = router;
