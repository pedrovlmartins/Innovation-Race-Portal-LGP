var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));
var irp = require(path.join(__base, 'lib', 'irp'));
var users = require(path.join(__base, 'lib', 'users'));
var ideas = require(path.join(__base, 'lib', 'ideas'));

function nextUserInfo(req, res, userInfo, typeDescription) {
  if (userInfo === undefined) {
    res.sendStatus(404);
  }
  else {
    db.getUserType(req.session.userID, function (type) {
      if (req.session !== undefined) {
        if (users.isAdmin(type) || parseInt(req.session.userID) === userInfo.id) {
          db.getUserIdeas(req.params.id, function(userIdeas) {
            userIdeas.forEach(
              (idea) => idea.state = ideas.getStateName(idea.state, idea.cancelled)
            );
            userInfo.firstName = userInfo.name.split(' ')[0];
            userInfo.userID = req.session.userID;
            userInfo.typeDescription = typeDescription;
            userInfo.ideas = userIdeas;
            res.render('user', userInfo);
          })
        } else
          res.sendStatus(403);
      }
    });
  }
};

router.get('/:id', function (req, res) {
  if (req.session.userID === undefined)
    res.sendStatus(401);
  else {
    db.getUserType(req.params.id, function (type) {
      if (type === 3) {
        db.getEmployeeInfo(req.params.id, function (userInfo) {
          nextUserInfo(req, res, userInfo, users.getTypeDescription(type))
        });
      } else if (users.isParticipant(type)) {
        db.getPartnerCostumerInfo(req.params.id, function (userInfo) {
          nextUserInfo(req, res, userInfo, users.getTypeDescription(type))
        });
      } else {
        res.sendStatus(404);
      }
    });
  }
});

module.exports = router;
