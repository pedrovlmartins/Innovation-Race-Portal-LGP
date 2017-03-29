/**
 * Created by Afonso on 25/03/2017.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

router.post('/auth/register', function(req, res) {
  if(!req.body.name || typeof req.body.name != "string") {
    res.status(400).send("400 Bad Request");
    return;
  }

  res.send("Name: " + req.body.name); // TODO
})

module.exports = router;
