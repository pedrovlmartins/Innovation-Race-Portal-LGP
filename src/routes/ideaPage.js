var express = require('express');
var router = express.Router();
var db = require('../database/database');

router.get('/:id', function (req, res) {
  db.getIdea(req.params.id, function (ideaInfo) {
    db.getTeamMembers(req.params.id, function (members) {
      res.render('ideaPage', {
        name: ideaInfo[0].name,
        leader: ideaInfo[0].creator,
        description: ideaInfo[0].description,
        resultsToProduce: ideaInfo[0].resultsToProduce,
        uncertaintyToSolve: ideaInfo[0].uncertaintyToSolve,
        techHumanResources: ideaInfo[0].techHumanResources,
        solutionTechnicalCompetence: ideaInfo[0].solutionTechnicalCompetence,
        members: members,
      });
    });
  });
});

module.exports = router;
