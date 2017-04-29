const path = require('path');
var config = require(path.join(__base, 'config'));
const ideas = require(path.join(__base, 'lib', 'ideas'));
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
      'SELECT users.id AS creatorId, users.name AS creator,ideas.title, ideas.description,' +
      'ideas.solutionTechnicalCompetence, ideas.uncertaintyToSolve, ideas.techHumanResources,' +
      'ideas.resultsToProduce, ideas.state, ideas.cancelled ' +
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

  getUserType: function (id, next) {
    pool.query(
      'SELECT type ' +
      'FROM users ' +
      'WHERE id = ?;', [id], function (err, result) {
        if (typeof next === 'function') {
          if (result.length === 1)
            next(result[0].type);
          else
            next(-1);
        }
      });
  },

  getUserEmail: function (id, next) {
    pool.query(
      'SELECT email ' +
      'FROM users ' +
      'WHERE id = ?;', [id], function (err, result) {
        if (err) {
          next(err);
        } else if (result.length == 0) {
          next('User not found');
        } else {
          next(null, result[0].email);
        }
      });
  },

  getUsersCount: function (next) {
    pool.query('SELECT COUNT(*) AS count ' +
      'FROM users;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listUsers: function (limit, offset, next) {
    pool.query('SELECT users.name, users.email, users.role ' +
      'FROM users ' +
      'ORDER BY name ' +
      'LIMIT ?, ?;', [limit, offset], function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listIdeas: function (limit, offset, next) {
    pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
      'ideas.state, ideas.cancelled, users.id AS idCreator, users.name AS creator ' +
      'FROM ideas ' +
      'JOIN users ON users.id = ideas.idCreator ' + 'ORDER BY ideas.title ' +
      'LIMIT ?, ?;', [limit, offset], function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  getIdeaCount: function (next) {
    pool.query('SELECT COUNT(*) AS count ' +
      'FROM ideas;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  searchUsers: function (key, limit, offset, next) {
    var varPattern = '%' + key + '%';
    pool.query('SELECT * FROM users WHERE name LIKE ? or email' +
      ' LIKE ? or role LIKE ? ' +
      'ORDER BY users.name ' +
      'LIMIT ?, ?;', [varPattern, varPattern, varPattern, limit, offset],
      function (error, results) {
        if (error) {
          console.error(error);
          next(error);
        } else {
          next(null, results);
        }
      });
  },

  searchIdeas: function (key, limit, offset, next) {
    var varPattern = '%' + key + '%';
    pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
      'ideas.state, users.id, users.name AS creator ' +
      'FROM ideas ' +
      'JOIN users ON users.id = ideas.idCreator ' +
      'WHERE users.name LIKE ? OR ideas.title LIKE ? OR ideas.state LIKE ?' +
      'ORDER BY ideas.title ' +
      'LIMIT ?, ?;', [varPattern, varPattern, varPattern, limit, offset],
      function (error, results) {
        if (error) {
          console.error(error);
          next(error);
        } else {
          next(null, results);
        }
      });
  },

  updateIdeaState_validate: function (id, state, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? AND cancelled = FALSE;', [state, id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  updateIdeaState_decline: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET cancelled = 1 ' +
      'WHERE ideas.id = ? AND cancelled = FALSE;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  updatedIdeaState_select: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? ' +
      'AND state = ? ' +
      'AND cancelled = FALSE;',
      [ideas.states.SELECTED, id, ideas.states.AWAITING_SELECTION],
      function (err, result) {
        if (err) {
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  classifyIdea: function (ideaID, strategyAlignment, offerType, market, technicalViability,
                          economicalViability, riskFactors, otherRequirements, next) {
    pool.query('UPDATE ideas SET state = ?, strategyAlignment = ?, offerType = ?, market = ?,' +
      ' technicalViability = ?, economicalViability = ?, riskFactors = ?, otherRequirements = ?' +
      ' WHERE id = ?',
      [ideas.states.AWAITING_EVALUATION, strategyAlignment, offerType,
        market, technicalViability, economicalViability, riskFactors,
        otherRequirements, ideaID,
      ],
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
