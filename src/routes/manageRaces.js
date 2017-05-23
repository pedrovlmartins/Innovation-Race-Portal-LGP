const path = require('path');
const irp = require(path.join(__base, 'lib', 'irp'));
const toCSV = require('array-to-csv');
const fs = require('fs');

var express = require('express');
var router = express.Router();
var database = require('../database/database');
var ideas = require(path.join(__base, 'lib', 'ideas'));
var races = require(path.join(__base, 'lib', 'races'));
var users = require(path.join(__base, 'lib', 'users'));


const itemsPerPage = 10.0;

router.get('/', function (req, res) {
    if (!users.isManager(irp.currentUserType(req))) {
        irp.addError(req, 'You need to be a manager in order to manage races.');
        res.redirect('../');
    } else {
        var vars = irp.getActionResults(req);
        var keyword = req.query.keyword;
        var offset;
        var page;

        if (req.query.page === undefined) {
            offset = 0;
            page = 1;
        } else {
            page = parseInt(req.query.page);
            if (isNaN(page)) {
                offset = 0;
                page = 1;
            } else if (page < 1) {
                offset = 0;
                page = 1;
            } else offset = (page - 1) * itemsPerPage;
        }

        vars.page = page;

        database.getRaceCount(function (result) {
            var numberOfRaces = result[0].count;
            vars.totalPages = Math.ceil(numberOfRaces / itemsPerPage);
            database.listRaces(offset, itemsPerPage, function (result) {
                var currentDate = new Date();
                result.forEach(function (race) {
                    var phase = races.getPhase(race.phase1Start, race.phase2Start,
                        race.phase3Start, race.phase4Start, race.phase4End);
                    race.phase = races.getPhaseDescription(phase);
                    race.finished = (phase == races.phases.FINISHED);
                });

                vars.races = result;
                vars.currentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
                    .toISOString().substring(0, 19);
                if (req.session.userID !== undefined)
                    vars.userID = req.session.userID;
                res.render('manageRaces', vars);
                irp.cleanActionResults(req);
            });
        });
    };
});

router.post('/exportDatabase', function(req, res) {
    database.getUserType(req.session.userID, function (type) {
        if (!users.isAdmin(type)) {
            irp.addError(req, 'You need to be a manager in order to export databases.');
            res.redirect('/');
        } else {
            var today = new Date();
            var cDate = today.getDate();
            var cMonth = today.getMonth() + 1;
            var cYear = today.getFullYear();

            var cHour = today.getHours();
            var cMin = today.getMinutes();
            var cSec = today.getSeconds();

            var dateString = cYear.toString() + cMonth.toString() + cDate.toString() + '_' + cHour.toString() + cMin.toString() + cSec.toString();

            var dir = path.join(__base, 'csv', dateString);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            database.getTableNames(function (tables) {
                var foo = tables.map((table) => new Promise((resolve, reject) => database.getTableInfo(table.table_name, function (rows) {
                        var rows_array = [];
                        for (var row = 0; row < rows.length; ++row) {
                            var row_array = [];
                            for (var col in rows[row]) {
                                row_array.push(rows[row][col]);
                            }
                            rows_array.push(row_array);
                        }
                        var csv = toCSV(rows_array);
                        fs.writeFile(path.join(dir, table.table_name + '.csv'), csv, function (err) {
                            if (err) {
                                irp.addError(req, 'Error exporting database.');
                                res.redirect('back');
                            }
                        });
                        resolve(rows_array);
                    })
                ))
                ;
            });
            irp.addSuccess(req, 'Database exported successfully.');
            res.redirect('back');
        }
    });
});

router.post('/create', function (req, res) {
    if (!users.isManager(irp.currentUserType(req))) {
        irp.addError(req, 'You need to be a manager in order to create a race.');
        res.redirect('back');
        return;
    }

    validate(req);
    req.Validator.getErrors(function (errors) {
        if (errors.length == 0) {
            database.createRace(req.body.title, req.body.description, req.body.phase1Start,
                req.body.phase2Start, req.body.phase3Start, req.body.phase4Start, req.body.phase4End,
                function (error, result) {
                    if (error) {
                        irp.addError(req, 'Unknown error occured.');
                    } else {
                        irp.addSuccess(req, 'Race successfully created.');
                    }

                    res.redirect('back');
                });
        } else {
            errors.forEach(function (item, index) {
                irp.addError(req, item);
            });

            res.redirect('back');
        }
    });
});

router.post('/terminate/:id', function (req, res) {
    if (irp.currentUserType(req) !== users.types.MANAGER) {
        irp.addError(req, 'You need to be a manager in order to terminate a race.');
        res.redirect('back');
        return;
    }

    database.terminateRace(req.params.id, function (error, result) {
        if (error) {
            irp.addError(req, 'Unknown error occurred.');
        } else if (result.affectedRows == 0) {
            irp.addError(req, 'The race provided cannot be terminated.');
        } else {
            irp.addSuccess(req, 'Successfully terminated race.');
        }

        res.sendStatus(200);
    });
});

var validate = function (req) {
    // Documentation for the form validator: https://www.npmjs.com/package/form-validate
    req.Validator.validate('title', 'Title', {
        required: true,
        length: {
            min: 3,
            max: 1000,
        },
    })
        .validate('description', 'Description', {
            required: false,
            length: {
                max: 5000,
            },
        })
        .validate('phase1Start', 'Think Geek phase start date', {
            required: true,
        })
        .validate('phase2Start', 'Validation phase start date', {
            required: true,
        })
        .validate('phase3Start', 'Coaching phase start date', {
            required: true,
        })
        .validate('phase4Start', 'Kick-Off phase start date', {
            required: true,
        })
        .validate('phase4End', 'Kick-Off phase end date', {
            required: true,
        });
};

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

module.exports = router;