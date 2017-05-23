var express = require('express');
const path = require('path');
var database = require(path.join(__base, 'database', 'database'));
var passwordHashAndSalt = require('password-hash-and-salt');
const irp = require(path.join(__base, 'lib', 'irp'));
var router = express.Router();
var users = require(path.join(__base, 'lib', 'users'));
var crypto = require('crypto');
var EmailTemplate = require('email-templates').EmailTemplate;
var email = require(path.join(__base, 'lib', 'mailer'));

router.get('/reset/:token', function(req, res) {
    var vars = irp.getActionResults(req);
    if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
    res.render('passwordChange', vars);
});

module.exports = router;
