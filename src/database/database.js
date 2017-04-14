const path = require('path');
var config = require(path.join(__base, 'config'));
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'irp',
});

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
    pool.query('SELECT * FROM users', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listAllIdeas: function (next) {
    pool.query('SELECT * FROM ideas', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },
};

