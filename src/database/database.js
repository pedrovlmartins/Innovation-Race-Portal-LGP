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

  createAdmin: function (name, email, passwordHash, type, role,
                         emailConfirmationToken, callback, next) {
    pool.query('INSERT INTO users' +
      ' (name, email, passwordHash, type' +
      ', role, emailConfirmationToken)' +
      ' VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, type, emailConfirmationToken],
      function (err, rows, fields) {
        callback(err);
      });
  },

  createIdea: function (creatorId, race, title, description, uncertaintyToSolve,
                        solutionTechnicalCompetence, techHumanResources, resultsToProduce,
                        callback) {
    pool.query('INSERT INTO ideas' +
      ' (idCreator, race, title, description, state' +
      ', uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, resultsToProduce)' +
      ' VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)',
      [creatorId, race, title, description, uncertaintyToSolve, solutionTechnicalCompetence,
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

    getUserByToken: function (token, callback) {
        pool.query('SELECT * FROM users WHERE resetPasswordToken = ?',
            [token],
            function (error, results, fields) {
                if (error) {
                    console.error(error);
                    callback(error);
                } else {
                    callback(null, results.length > 0 ? results[0] : null);
                }
            });
    },

  updateUserName: function (id, newName, next) {
    pool.query('UPDATE users' +
      ' SET name = ? ' +
      ' WHERE id = ?', [newName, id],
      function (error, result) {
        if (error) {
          console.error(error);
          next(error);
        } else {
          next(null, result);
        }
      });
  },

  updateUserMail: function (id, newMail, next) {

    pool.query('UPDATE users' +
      ' SET  email = ? ' +
      ' WHERE id = ?', [newMail, id],
      function (err, result) {
        if (err) {
          console.error(err);
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  updateUserPassword: function (id, newPassword, next) {
    pool.query('UPDATE users' +
      ' SET  passwordHash = ? ' +
      ' WHERE id = ?', [newPassword, id],
      function (err, result) {
        if (err) {
          console.error(err);
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  updateUserType: function(id, newUserType, next){
    pool.query('UPDATE users' +
      ' SET type = ? '+
      ' WHERE id = ?', [newUserType, id],
      function (err, result) {
        if (err) {
          console.error(err);
          next(err);
        } else {
          next(null, result);
        }
      })
  },

  getPartnerClientInfo: function (id, next) {
    pool.query(
      'SELECT users.id, users.name, users.email, users.referral ' +
      'FROM users ' +
      'WHERE users.id = ?', [id], function (err, result) {
        if (typeof next === 'function')
          next(result[0]);
      }
    );
  },

  getEmployeeInfo: function (id, next) {
    pool.query(
      'SELECT users.id, users.name, users.email, users.colaboratorNum, users.businessField, manager.name AS manager ' +
      'FROM users ' +
      'JOIN users manager ON users.manager = manager.id ' +
      'WHERE users.id = ?', [id], function (err, result) {
        if (typeof next === 'function')
          next(result[0]);
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

  getUserIdeas: function (id, limit, offset, next) {
    pool.query(
      'SELECT ideas.id, ideas.title, ideas.state, ideas.cancelled, ideas.score ' +
      'FROM ideas ' +
      'WHERE ideas.idCreator = ? ' +
      'ORDER BY ideas.title ' +
      'LIMIT ?, ?;', [id, limit, offset], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  getUserIdeasCount: function (id, next) {
    pool.query(
      'SELECT COUNT(*) AS count ' +
      'FROM ideas ' +
      'WHERE idCreator = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result[0].count);
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

  getUserName: function(id, next) {
    pool.query(
      'SELECT name ' +
      'FROM users ' +
      'WHERE id = ?', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      }
    )
  },

  getUsersCount: function (next) {
    pool.query('SELECT COUNT(*) AS count ' +
      'FROM users;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listUsers: function (limit, offset, next) {
    pool.query('SELECT users.id, users.name, users.email, users.blocked, users.confirmed, users.type ' +
      'FROM users ' +
      'ORDER BY users.type ' +
      'LIMIT ?, ?;', [limit, offset], function (error, results) {
      if (typeof next === 'function')
        next(error, results);
    });
  },

  listIdeas: function (limit, offset, next) {
    pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
      'ideas.state, ideas.cancelled, users.id AS idCreator, users.name AS creator ' +
      'FROM ideas ' +
      'JOIN users ON users.id = ideas.idCreator ' + 'ORDER BY ideas.cancelled, ideas.state ASC ' +
      'LIMIT ?, ?;', [limit, offset], function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listIdeasRanking: function (limit, offset, next) {
    pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
      'ideas.state, ideas.cancelled, ideas.score, users.id AS idCreator, users.name AS creator ' +
      'FROM ideas ' +
      'JOIN users ON users.id = ideas.idCreator ' + 'ORDER BY ideas.score DESC ' +
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

  getRaceCount: function (next) {
    pool.query('SELECT COUNT(*) AS count ' +
      'FROM races;', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },

  listRaces: function (limit, offset, next) {
    pool.query('SELECT * FROM races ' +
      'ORDER BY phase1Start DESC ' +
      'LIMIT ?, ?;', [limit, offset], function (error, results) {
      if (typeof next === 'function')
        next(results);
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

  createRace: function (title, description, phase1Start, phase2Start,
                        phase3Start, phase4Start, phase4End, next) {
    pool.query('INSERT INTO races' +
      ' (title, description, phase1Start, phase2Start, phase3Start, phase4Start, phase4End)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, phase1Start, phase2Start,
        phase3Start, phase4Start, phase4End,
      ],
      function (error, results) {
        if (error) {
          next(error);
        } else {
          next(null, results);
        }
      });
  },

  terminateRace: function (id, next) {
    pool.query('UPDATE races SET' +
      ' phase1Start = LEAST(CURRENT_TIMESTAMP, phase1Start)' +
      ', phase2Start = LEAST(CURRENT_TIMESTAMP, phase2Start)' +
      ', phase3Start = LEAST(CURRENT_TIMESTAMP, phase3Start)' +
      ', phase4Start = LEAST(CURRENT_TIMESTAMP, phase4Start)' +
      ', phase4End = LEAST(CURRENT_TIMESTAMP, phase4End)' +
      ' WHERE id = ?', [id],
      function (error, results) {
        console.error(error);
        next(error, results);
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
      'ORDER BY ideas.state ' +
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

  /*
  updateIdeaState_validate: function (id, state, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? AND cancelled = FALSE;', [state, id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },
*/

  updateIdeaState_decline: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET cancelled = 1 ' +
      'WHERE ideas.id = ? AND cancelled = FALSE;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },


  updatedIdeaState_evaluate: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? ' +
      'AND state = ? ' +
      'AND cancelled = FALSE;',
      [ideas.states.AWAITING_SELECTION, id, ideas.states.AWAITING_EVALUATION],
      function (err, result) {
        if (err) {
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  updatedIdeaState_select: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? ' +
      'AND state = ? ' +
      'AND cancelled = FALSE;',
      [ideas.states.IN_COACHING_PHASE, id, ideas.states.AWAITING_SELECTION],
      function (err, result) {
        if (err) {
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  updatedIdeaState_go: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? ' +
      'AND state = ? ' +
      'AND cancelled = FALSE;',
      [ideas.states.BEING_IMPLEMENTED, id, ideas.states.AWAITING_GO_NO_GO],
      function (err, result) {
        if (err) {
          next(err);
        } else {
          next(null, result);
        }
      });
  },

  updatedIdeaState_coaching: function (id, next) {
    pool.query(
      'UPDATE ideas ' +
      'SET state = ? ' +
      'WHERE ideas.id = ? ' +
      'AND state = ? ' +
      'AND cancelled = FALSE;',
      [ideas.states.AWAITING_GO_NO_GO, id, ideas.states.IN_COACHING_PHASE],
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

  blockUser: function (id, next) {
    pool.query(
      'UPDATE users ' +
      'SET blocked = 1 ' +
      'WHERE users.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  unblockUser: function (id, next) {
    pool.query(
      'UPDATE users ' +
      'SET blocked = 0 ' +
      'WHERE users.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  updateToken: function (token, id, next) {
      if (token == 'NULL') {
          pool.query(
              'UPDATE users ' +
              'SET resetPasswordToken = NULL ' +
              'WHERE users.id = ?;', [id], function(err, result) {
                  if (typeof next === 'function')
                      next(result);
              });
      } else {
          pool.query(
              'UPDATE users ' +
              'SET resetPasswordToken = ? ' +
              'WHERE users.id = ?;', [token, id], function(err, result) {
                  if (typeof next === 'function')
                      next(result);
              });
      }
  },

  confirmUser: function (id, next) {
    pool.query(
        'UPDATE users ' +
        'SET confirmed = 1 ' +
        'WHERE users.id = ?;', [id], function (err, result) {
          if (typeof next === 'function')
            next(result);
        });
  },

  saveDraft: function (userId, title, description,
                       uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources,
                       results, callback, next) {

    pool.query('INSERT INTO drafts' +
      ' (user_id, title, description, ' +
      'uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, results)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ' +
      'title = ?, ' +
      'description = ?, ' +
      'uncertaintyToSolve = ?, ' +
      'solutionTechnicalCompetence =?, ' +
      'techHumanResources = ?, ' +
      'results = ?;',
      [userId, title, description, uncertaintyToSolve,
        solutionTechnicalCompetence, techHumanResources, results, title, description,
        uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, results,
      ],
      function (err, rows, fields) {
        callback(err);
      });
  },

  removeDraft: function (userId, next) {

      pool.query('DELETE FROM drafts WHERE drafts.user_id = ? ;',
          [userId],
          function (err, result) {
              next(result);
          });
  },

  loadDraft: function (userId, next) {

    pool.query('SELECT * FROM drafts WHERE drafts.user_id = ? ;',
      [userId],
      function (err, result) {
        next(result);
      });
  },

  insertBMC: function (ideaID, keyPartners, keyActivities, keyResources, valuePropositions,
                       costumerSegments, costumerRelationships, channels, costStructure,
                       revenueStreams, callback) {
    pool.query('INSERT INTO BMC' +
      ' (ideaID, keyPartners, keyActivities, keyResources, valuePropositions, costumerSegments, ' +
      ' costumerRelationships, channels, costStructure, revenueStreams)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ideaID, keyPartners, keyActivities, keyResources, valuePropositions, costumerSegments,
        costumerRelationships, channels, costStructure, revenueStreams,
      ],
      function (err, rows, fields) {
        callback(err);
      });
  },

  // CSV-exporting queries

  getTableNames: function (next) {
    pool.query('SELECT table_name ' +
      'FROM information_schema.tables ' +
      'WHERE table_schema=?', [config.mysql[config.env].database], function (err, rows, fields) {
      if (typeof next === 'function')
        next(rows);
    });
  },

  getTableInfo: function (table, next) {
    pool.query('SELECT * FROM ' + table, [], function (err, rows, fields) {
      if (typeof next === 'function') {
        next(rows);
      }
    });
  },
};
