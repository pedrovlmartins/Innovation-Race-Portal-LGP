const path = require('path');
var config = require(path.join(__base, 'config'));
var mysql = require('mysql');

var pool = mysql.createPool(config.mysql[config.env]);

module.exports = {
  createUser: function (name, email, passwordHash, type, businessField, collaboratorNum, role,
                                        emailConfirmationToken, callback, next) {
    pool.query('INSERT INTO users' +
    ' (name, email, passwordHash, type, businessField, colaboratorNum' +
    ', role, emailConfirmationToken)' +
    ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, passwordHash, type, businessField, collaboratorNum, role, emailConfirmationToken],
    function (err, rows, fields) {
      callback(err);
    });
  },

  createIdea: function (creatorId, race, title, description, uncertaintyToSolve,
                        solutionTechnicalCompetence, techHumanResources, resultsToProduce,
                        callback) {
    pool.query('INSERT INTO ideas' +
      ' (idCreator, race, title, description,' +
      ' uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, resultsToProduce)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [creatorId, title, description, uncertaintyToSolve, solutionTechnicalCompetence,
      techHumanResources, resultsToProduce,
    ],
    function (err, results, fields) {
      if (err)
        callback(err);
      else
        callback(null, results.insertId);
    });
  },

  getUserByEmail: function (email, callback) {
    pool.query('SELECT * FROM users WHERE email = ?',
      [email],
      function (error, results, fields) {
        if (error) {
          console.error(error);
          callback(error);
        } else {
          callback(null, results.length > 0 ? results[0] : null);
        }
      });
  },

  getIdea: function (id, next) {
    pool.query(
      'SELECT users.id AS creatorId, users.name AS creator,ideas.name, ideas.description,' +
      'ideas.solutionTechnicalCompetence, ideas.uncertaintyToSolve, ideas.techHumanResources,' +
      'ideas.resultsToProduce ' +
      'FROM ideas ' +
      'JOIN users ' +
      'ON users.id = ideas.idCreator ' +
      'WHERE ideas.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result[0]);
      });
  },

  getTeamMembers: function (id, next) {
    pool.query(
      'SELECT users.id, users.name ' +
      'FROM users ' +
      'JOIN ideamember ON ideamember.idMember = users.id ' +
      'JOIN ideas ON ideamember.idIdea = ideas.id ' +
      'WHERE ideas.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  validateAccount: function (token, callback, next) {
    pool.query('UPDATE users SET emailConfirmationToken = NULL, accountStatus = 1' +
      ' WHERE emailConfirmationToken = ?', [token], function (error, results, fields) {
      if (error) {
        console.error(error);
        callback(error);
      } else {
        callback(null, results.affectedRows === 0 ? false : true);
      }
    });
  },

  listAllUsers: function (next) {
    pool.query('SELECT * FROM users;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listAllIdeas: function (next) {
    pool.query('SELECT * FROM ideas;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  searchUsers: function (key, next) {
    var varPattern = '%' + key + '%';
    pool.query('SELECT * FROM users WHERE name LIKE ? or email' +
      ' LIKE ? or role LIKE ?;', [varPattern, varPattern, varPattern],
      function (error, results) {
      if (error) {
        console.error(error);
        next(error);
      } else {
        next(null, results);
      }
    });
  },

  searchIdeas: function (key, next) {
    var varPattern = '%' + key + '%';
    pool.query('SELECT * FROM ideas WHERE teamName LIKE ? or state' +
      ' LIKE ?', [varPattern, varPattern],
      function (error, results) {
        if (error) {
          console.error(error);
          next(error);
        } else {
          next(null, results);
        }
      });
  },

  getActiveRaces: function (next) {
    pool.query('SELECT * FROM races WHERE CURRENT_TIMESTAMP BETWEEN phase1Start AND phase2Start',
      function (error, results) {
        if (error) {
          console.error(error);
          next(error);
        } else {
          next(null, results);
        }
      });
  },

};

