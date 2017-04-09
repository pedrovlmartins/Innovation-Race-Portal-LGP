var express = require('express');
var router = express.Router();
var path = require('path');
var db = require(path.join(__base, 'database', 'database'));

router.get('/:id', function (req, res) {
  db.getIdea(req.params.id, function (ideaInfo) {
    db.getTeamMembers(req.params.id, function (members) {
      var ids = members.map((member) => {
        member.id;
      });
      ids.push(ideaInfo.creatorId);
      if (req.session !== undefined) {
        if (ids.indexOf(req.session.userID) !== -1)
          res.render('ideaPage', {
            name: ideaInfo.name,
            leader: ideaInfo.creator,
            description: ideaInfo.description,
            resultsToProduce: ideaInfo.resultsToProduce,
            uncertaintyToSolve: ideaInfo.uncertaintyToSolve,
            techHumanResources: ideaInfo.techHumanResources,
            solutionTechnicalCompetence: ideaInfo.solutionTechnicalCompetence,
            members: members,
          });
      } else
        res.send(403);
    });
  });
});

module.exports = router;
