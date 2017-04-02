var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var router = express.Router();

router.get('/:token', function (req, res) {
  database.validateAccount(req.params.token, function () {

  });

  res.sendStatus(200);
});

module.exports = router;
