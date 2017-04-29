var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));

router.get('/:id', function (req, res) {
  if (req.session.userID === undefined)
    res.sendStatus(401);
  else {
    db.getUserInfoById(req.params.id, function (userInfo) {
      if (userInfo === undefined)
        res.sendStatus(404);
      else {
        db.getUserType(req.session.userID, function (type) {
            if (req.session !== undefined) {
              if (type >= 3 || parseInt(req.session.userID) === userInfo.id) {
                userInfo.firstName = userInfo.name.split(' ')[0];
                res.render('user', userInfo);
              } else
                res.sendStatus(403);
            }
          });
        }
    });
  }
});

module.exports = router;
