var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
var irp = require(path.join(__base, 'lib', 'irp'));
var users = require(path.join(__base, 'lib', 'users'));
var ideas = require(path.join(__base, 'lib', 'ideas'));


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

router.post('/:id/profile', function (req, res) {
    if (req.session.userID === undefined)
        res.sendStatus(401);

console.log(req.body);
console.log(req.params.id);

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
    });/*
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
    });*/

    /*
      //hashing and salting of newpassword
      passwordHashAndSalt(req.body.password).hash(function (error, passwordHash) {
        if (error) {
            console.error(err);
            irp.addError(req, error);
            res.redirect('../../');
            irp.cleanActionResults(req);
        };

        db.updateUserPassword(req.params.id, req, passwordHash, function(error,results){
          if(error){
            irp.addError(req, 'Unknown error occurred.');
          } else if(results.affectedRows === 0) {
              irp.addError(req, 'Could not update user information.');
          } else {
              irp.addSuccess(req, 'User information successfully updated.');
          }
          res.redirect('back');
        });

    });*/
});

module.exports = router;
