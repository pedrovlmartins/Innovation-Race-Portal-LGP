var express = require('express');
var path = require('path');
const crypto = require('crypto');
var passwordHashAndSalt = require('password-hash-and-salt');
var db = require(path.join(__base, 'database', 'database'));
var irp = require(path.join(__base, 'lib', 'irp'));
var users = require(path.join(__base, 'lib', 'users'));
var ideas = require(path.join(__base, 'lib', 'ideas'));
var router = express.Router();


const itemsPerPage = 10.0;

function nextUserInfo(req, res, userInfo, typeDescription) {
  if (userInfo === undefined) {
    res.sendStatus(404);
  }
  else {
    db.getUserType(req.session.userID, function (type) {
      if (req.session !== undefined) {
        if (users.isAdmin(type) || (req.session.userID === parseInt(req.params.id))) {
          userInfo.userID = req.session.userID;
          userInfo.isManager = users.isAdmin(type);
          userInfo.typeDescription = typeDescription;
          userInfo.page = 'profile';
          res.render('user', userInfo);
        } else
        res.sendStatus(403);
      }
    });
  }
}

router.get('/:id', function(req,res) {
  res.redirect(req.params.id + '/profile');
});

router.get('/:id/profile', function(req, res) {
  if (req.session.userID === undefined)
    res.sendStatus(401);
  else {
    db.getUserType(req.params.id, function (type) {

      if (type === users.types.ALTRAN_MEMBER) {
        db.getEmployeeInfo(req.params.id, function (userInfo) {
          nextUserInfo(req, res, userInfo, users.getTypeDescription(type))
        });
      } else if (users.isParticipant(type)) {
        db.getPartnerClientInfo(req.params.id, function (userInfo) {
          nextUserInfo(req, res, userInfo, users.getTypeDescription(type))
        });
      } else {
          console.log(type);
        res.sendStatus(404);
      }
    });
  }
});

router.get('/:id/ideas', function (req, res) {
  var offset;
  var pageNo;
  var vars = {};
  if (req.session.userID === undefined)
    res.sendStatus(401);
  else {
    if (req.query.page === undefined) {
      offset = 0;
      pageNo = 1;
    } else {
      pageNo = parseInt(req.query.page);
      if (isNaN(pageNo)) {
        offset = 0;
        pageNo = 1;
      } else if (pageNo < 1) {
        offset = 0;
        pageNo = 1;
      } else offset = (pageNo - 1) * itemsPerPage;
    }

    db.getUserType(req.session.userID, function (type) {
      if (req.session !== undefined) {
        if (users.isAdmin(type) || (req.session.userID === parseInt(req.params.id))) {
          db.getUserIdeas(req.params.id, offset, 10, function (userIdeas) {
            vars.userIdeas = userIdeas;
            db.getUserIdeasCount(req.params.id, function (ideaCount) {
              vars.pageTotal = Math.ceil(ideaCount/itemsPerPage);
              vars.userID = req.session.userID;
              vars.pageNo = pageNo;
              vars.page = 'ideas';
              if (vars.userIdeas.length > 0) {
                vars.userIdeas.forEach(
                  (idea) => idea.state = ideas.getStateName(idea.state, idea.cancelled)
              );
                vars.ideas = userIdeas;
              }
              res.render('user', vars);
            });
          });
        } else
          res.sendStatus(403);
      }
    });
  }
});

router.get('/:id/block', function(req, res) {
    if (req.session.userID === undefined)
        res.sendStatus(401);
    else {

        db.getUserType(req.session.userID, function (type) {
            if (users.isAdmin(type)) {
                db.blockUser(req.params.id, function () {
                    res.redirect("back");
                });
            } else {
                res.sendStatus(403);
            }
        });
    }
});

router.get('/:id/unblock', function(req, res) {
    if (req.session.userID === undefined)
        res.sendStatus(401);
    else {

        db.getUserType(req.session.userID, function (type) {
            if (users.isAdmin(type)) {
                db.unblockUser(req.params.id, function () {
                    res.redirect("back");
                });
            } else {
                res.sendStatus(403);
            }
        });
    }
});

router.get('/:id/confirm', function(req, res) {
    if (req.session.userID === undefined)
        res.sendStatus(401);
    else {

        db.getUserType(req.session.userID, function (type) {
            if (users.isAdmin(type)) {
                db.confirmUser(req.params.id, function () {
                    res.redirect("back");
                });
            } else {
                res.sendStatus(403);
            }
        });
    }
});

router.get('/:id/submitIdea', function(req, res) {

    if (req.session.userID === undefined)
        res.sendStatus(401);
        else if(req.session.userID != req.params.id)
            res.sendStatus(403);
    else {
        var userInfo = {};
        userInfo.userID = req.session.userID;
        userInfo.page = 'submitIdea';
        db.loadDraft(userInfo.userID, function(draft){
            userInfo.draft = {};

            if (draft != undefined && draft.length > 0){
                userInfo.draft = draft[0];
                res.render('user', userInfo);
            }
                else {
                res.render('user', userInfo);
            }
        });
    }
});

router.post('/:id/submit', function (req, res) {
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
               /* if (races.length == 0) {
                    irp.addError(req, 'You cannot submit a new idea because there is no active race.');
                    res.redirect('back');
                    return;
                }*/

                //var race = races[0].id;

                var race = 0;
                db.createIdea(irp.currentUserID(req), race, req.body.title, req.body.description,
                    req.body.uncertaintyToSolve, req.body.solutionTechnicalCompetence,
                    req.body.techHumanResources, req.body.results,
                    function (err, id) {
                        if (err) {
                            console.error(err);
                            irp.addError(req, err);
                            res.redirect('back');
                        } else {
                            irp.addSuccess(req, 'Idea successfully created.');
                            res.redirect('back');
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
        .validate('techHumanResources', 'Human and technological resources needed', {
            required: true,
            length: {
                min: 3,
            },
        })
        .validate('results', 'Results to be produced by the project', {
            required: true,
            length: {
                min: 3,
            },
        });
};

router.post('/:id/draft', function (req, res) {
    if (!irp.currentUserID(req)) {
        irp.addError(req, 'You are not logged in.');
        res.redirect('../../');
        return;
    }

    db.saveDraft(req.session.userID, req.body.title, req.body.description, req.body.teamIdea, req.body.teammembers,
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

router.post('/:id/name', function (req, res) {

    if (req.session.userID === undefined)
        res.sendStatus(401);

    db.updateUserName(req.params.id, req.body.name, function(error, results){
        if (error) {
            irp.addError(req, 'Unknown error occurred.');
        } else if (results.affectedRows === 0) {
            irp.addError(req, 'Could not update user information.');
        } else {
            irp.addSuccess(req, 'User information successfully updated.');
        }
        res.redirect('back');
        return;

    });

});

router.post('/:id/email', function (req, res) {

    if (req.session.userID === undefined)
        res.sendStatus(401);

    db.updateUserMail(req.params.id, req.body.email, function(error, results){
        if (error) {
            irp.addError(req, 'Unknown error occurred.');
        } else if (results.affectedRows === 0) {
            irp.addError(req, 'Could not update user information.');
        } else {
            irp.addSuccess(req, 'User information successfully updated.');
        }
        res.redirect('back');
        return;
    });

});

router.post('/:id/password', function (req, res){

    if (req.session.userID === undefined)
        res.sendStatus(401);
    console.log('Entrou no update pasword');
     //hashing and salting of newpassword
     passwordHashAndSalt(req.body.password).hash(function (error, passwordHash) {
         if (error) {
             console.error(error);
             irp.addError(req, error);
             res.redirect('../../');
     irp.cleanActionResults(req);
         };
     db.updateUserPassword(req.params.id, passwordHash, function(error,results){
         if(error){
     irp.addError(req, 'Unknown error occurred.');
         } else if(results.affectedRows === 0) {
             irp.addError(req, 'Could not update user information.');
         } else {
             irp.addSuccess(req, 'User information successfully updated.');
     }
     res.redirect('back');
     });
     });
});

module.exports = router;
