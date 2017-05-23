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

var resetEmailTemplateDir = path.join(__base, 'views', 'emails', 'reset');
var activationEmailTemplateDir = path.join(__base, 'views', 'emails', 'activation');

router.get('/', function(req, res) {
    var vars = irp.getActionResults(req);
    if (req.session.userID !== undefined)
        vars.userID = req.session.userID;
    res.render('passwordReset', vars);
});

router.get('/:token', function(req, res) {
    database.getUserByToken(req.params.token, function(err, user) {
        if (err) {
            irp.addError(req, 'Unknown error occurred, please try again later.');
            res.redirect('../../');
        } else if (user) {
            var vars = irp.getActionResults(req);
            if (req.session.userID !== undefined)
                vars.userID = req.session.userID;
            res.render('passwordChange', vars);
        }  else {
            res.sendStatus(404);
        }
    });
});

router.post('/', function(req, res, next) {
    database.getUserByEmail(req.body.email, function(err, user) {
        if (err) {
            irp.addError(req, 'Unknown error occurred, please try again later.');
            res.redirect('../../');
        } else if (user) {
            var token = crypto.randomBytes(32).toString('hex');

            database.updateToken(token, user.id, function () {
            });

            sendResetEmail(req.body.email, token, function(err) {
                if (err) {
                    console.error(err);
                    irp.addError(req, err);
                } else {
                    irp.addSuccess(req, 'Thank you! Please follow the instructions that were sent to ' + token);
                }

                res.redirect('../../');
                irp.cleanActionResults(req);
            });

        } else {
            irp.addError(req, 'No user found with email "' + req.body.email + '".');
            res.redirect('../../');
        }
    });
});

var sendResetEmail = function(to, token, callback) {
    var mailer = new EmailTemplate(resetEmailTemplateDir);
    var user = {
        resetToken: token,
        resetURL: 'http://localhost:8080/passwordReset/' + token,
        replyTo: 'altran@musaic.ml',
    };
    mailer.render(user, function(err, result) {
        if (err) console.error(err);
        email.send(to, 'Innovation Race Portal - Password reset required', result.text, result.html,
            function(error, body) {
                callback(error, body);
            });
    });
};

module.exports = router;
