/**
 * Created by Afonso on 25/03/2017.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
