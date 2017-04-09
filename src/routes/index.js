const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', irp.getActionResults(req));
  irp.cleanActionResults(req);
});

module.exports = router;
