const path = require('path');
var config = require(path.join(__base, 'config'));
const ideas = require(path.join(__base, 'lib', 'ideas'));
var mysql = require('mysql');

var pool = mysql.createPool(config.mysql[config.env]);

module.exports = {
    createUser: function(name, email, passwordHash, type, businessField, collaboratorNum, role,
                         emailConfirmationToken, callback, next) {
        pool.query('INSERT INTO users' +
            ' (name, email, passwordHash, type, businessField, colaboratorNum' +
            ', role, emailConfirmationToken)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, passwordHash, type, businessField, collaboratorNum, role, emailConfirmationToken],
            function(err, rows, fields) {
                callback(err);
            });
    },

    createIdea: function(creatorId, race, title, description, uncertaintyToSolve,
                         solutionTechnicalCompetence, techHumanResources, resultsToProduce,
                         callback) {
        pool.query('INSERT INTO ideas' +
            ' (idCreator, race, title, description' +
            ', uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, resultsToProduce)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [creatorId, race, title, description, uncertaintyToSolve, solutionTechnicalCompetence,
                techHumanResources, resultsToProduce],
            function(err, results, fields) {
                if (err)
                    callback(err);
                else
                    callback(null, results.insertId);
            });
    },

    getUserByEmail: function(email, callback) {
        pool.query('SELECT * FROM users WHERE email = ?',
            [email],
            function(error, results, fields) {
                if (error) {
                    console.error(error);
                    callback(error);
                } else {
                    callback(null, results.length > 0 ? results[0] : null);
                }
            });
    },

  updateUserName: function(id, newName, next){
    pool.query('UPDATE users' +
      ' SET name = ? ' +
      ' WHERE id = ?',[newName, id],
        function (error, result){
          if (error) {
              console.error(error);
              next(error);
          } else {
              next(null, result);
          }
    });
  },

  updateUserMail: function(id, newMail, next){

      pool.query('UPDATE users' +
          ' SET  email = ? ' +
          ' WHERE id = ?',[newMail, id],
          function (err, result){
              if (err) {
                  console.error(err);
                  next(err);
              } else {
                  next(null, result);
              }
          });
  },

  updateUserPassword:function(id, newPassword, next){
      pool.query('UPDATE users' +
          ' SET  passwordHash = ? ' +
          ' WHERE id = ?',[newPassword, id],
          function (err, result){
              if (err) {
                  console.error(err);
                  next(err);
              } else {
                  next(null, result);
              }
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

    getPartnerClientInfo: function(id, next) {
        pool.query(
            'SELECT users.id, users.name, users.email, users.referral ' +
            'FROM users ' +
            'WHERE users.id = ?', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result[0]);
            }
        );
    },

    getEmployeeInfo: function(id, next) {
        pool.query(
            'SELECT users.id, users.name, users.email, users.colaboratorNum, users.businessField, manager.name AS manager ' +
            'FROM users ' +
            'JOIN users manager ON users.manager = manager.id ' +
            'WHERE users.id = ?', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result[0]);
            });
    },

    getIdea: function(id, next) {
        pool.query(
            'SELECT users.id AS creatorId, users.name AS creator,ideas.title, ideas.description,' +
            'ideas.solutionTechnicalCompetence, ideas.uncertaintyToSolve, ideas.techHumanResources,' +
            'ideas.resultsToProduce, ideas.state, ideas.cancelled ' +
            'FROM ideas ' +
            'JOIN users ' +
            'ON users.id = ideas.idCreator ' +
            'WHERE ideas.id = ?;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result[0]);
            });
    },

    getUserIdeas: function(id, limit, offset, next) {
        pool.query(
            'SELECT ideas.id, ideas.title, ideas.state, ideas.cancelled, ideas.score ' +
            'FROM ideas ' +
            'WHERE ideas.idCreator = ? ' +
            'ORDER BY ideas.title ' +
            'LIMIT ?, ?;', [id, limit, offset], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    getUserIdeasCount: function(id, next) {
        pool.query(
            'SELECT COUNT(*) AS count ' +
            'FROM ideas ' +
            'WHERE idCreator = ?;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result[0].count);
            });
    },

    getTeamMembers: function(id, next) {
        pool.query(
            'SELECT users.id, users.name ' +
            'FROM users ' +
            'JOIN ideamember ON ideamember.idMember = users.id ' +
            'JOIN ideas ON ideamember.idIdea = ideas.id ' +
            'WHERE ideas.id = ?;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    validateAccount: function(token, callback, next) {
        pool.query('UPDATE users SET emailConfirmationToken = NULL, accountStatus = 1' +
            ' WHERE emailConfirmationToken = ?', [token], function(error, results, fields) {
            if (error) {
                console.error(error);
                callback(error);
            } else {
                callback(null, results.affectedRows === 0 ? false : true);
            }
        });
    },

    getUserType: function(id, next) {
        pool.query(
            'SELECT type ' +
            'FROM users ' +
            'WHERE id = ?;', [id], function(err, result) {
                if (typeof next === 'function') {
                    if (result.length === 1)
                        next(result[0].type);
                    else
                        next(-1);
                }
            });
    },

    getUserEmail: function(id, next) {
        pool.query(
            'SELECT email ' +
            'FROM users ' +
            'WHERE id = ?;', [id], function(err, result) {
                if (err) {
                    next(err);
                } else if (result.length == 0) {
                    next('User not found');
                } else {
                    next(null, result[0].email);
                }
            });
    },

    getUsersCount: function(next) {
        pool.query('SELECT COUNT(*) AS count ' +
            'FROM users;', function(error, results) {
            if (typeof next === 'function')
                next(results);
        });
    },

    listUsers: function(limit, offset, next) {
        pool.query('SELECT users.id, users.name, users.email, users.blocked, users.type ' +
            'FROM users ' +
            'ORDER BY name ' +
            'LIMIT ?, ?;', [limit, offset], function(error, results) {
            if (typeof next === 'function')
                next(results);
        });
    },

    listIdeas: function(limit, offset, next) {
        pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
            'ideas.state, ideas.cancelled, users.id AS idCreator, users.name AS creator ' +
            'FROM ideas ' +
            'JOIN users ON users.id = ideas.idCreator ' + 'ORDER BY ideas.cancelled, ideas.title ASC ' +
            'LIMIT ?, ?;', [limit, offset], function(error, results) {
            if (typeof next === 'function')
                next(results);
        });
    },

    listIdeasRanking: function(limit, offset, next) {
        pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
            'ideas.state, ideas.cancelled, ideas.score, users.id AS idCreator, users.name AS creator ' +
            'FROM ideas ' +
            'JOIN users ON users.id = ideas.idCreator ' + 'ORDER BY ideas.score DESC ' +
            'LIMIT ?, ?;', [limit, offset], function(error, results) {
            if (typeof next === 'function')
                next(results);
        });
    },

    getIdeaCount: function(next) {
        pool.query('SELECT COUNT(*) AS count ' +
            'FROM ideas;', function(error, results) {
            if (typeof next === 'function')
                next(results);
        });
    },

    getRaceCount: function(next) {
      pool.query('SELECT COUNT(*) AS count ' +
        'FROM races;', function(error, results) {
        if (typeof next === 'function')
          next(results);
      });
    },

    listRaces: function(limit, offset, next) {
      pool.query('SELECT * FROM races ' +
        'ORDER BY phase1Start DESC ' +
        'LIMIT ?, ?;', [limit, offset], function(error, results) {
        if (typeof next === 'function')
          next(results);
      });
    },

    getActiveRaces: function(next) {
        pool.query('SELECT * FROM races WHERE CURRENT_TIMESTAMP BETWEEN phase1Start AND phase2Start',
            function(error, results) {
                if (error) {
                    console.error(error);
                    next(error);
                } else {
                    next(null, results);
                }
            });
    },

    searchUsers: function(key, limit, offset, next) {
        var varPattern = '%' + key + '%';
        pool.query('SELECT * FROM users WHERE name LIKE ? or email' +
            ' LIKE ? or role LIKE ? ' +
            'ORDER BY users.name ' +
            'LIMIT ?, ?;', [varPattern, varPattern, varPattern, limit, offset],
            function(error, results) {
                if (error) {
                    console.error(error);
                    next(error);
                } else {
                    next(null, results);
                }
            });
    },

    searchIdeas: function(key, limit, offset, next) {
        var varPattern = '%' + key + '%';
        pool.query('SELECT ideas.id, ideas.title, ideas.idCreator, ' +
            'ideas.state, users.id, users.name AS creator ' +
            'FROM ideas ' +
            'JOIN users ON users.id = ideas.idCreator ' +
            'WHERE users.name LIKE ? OR ideas.title LIKE ? OR ideas.state LIKE ?' +
            'ORDER BY ideas.title ' +
            'LIMIT ?, ?;', [varPattern, varPattern, varPattern, limit, offset],
            function(error, results) {
                if (error) {
                    console.error(error);
                    next(error);
                } else {
                    next(null, results);
                }
            });
    },

    updateIdeaState_validate: function(id, state, next) {
        pool.query(
            'UPDATE ideas ' +
            'SET state = ? ' +
            'WHERE ideas.id = ? AND cancelled = FALSE;', [state, id], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    updateIdeaState_decline: function(id, next) {
        pool.query(
            'UPDATE ideas ' +
            'SET cancelled = 1 ' +
            'WHERE ideas.id = ? AND cancelled = FALSE;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    updatedIdeaState_select: function(id, next) {
        pool.query(
            'UPDATE ideas ' +
            'SET state = ? ' +
            'WHERE ideas.id = ? ' +
            'AND state = ? ' +
            'AND cancelled = FALSE;',
            [ideas.states.SELECTED, id, ideas.states.AWAITING_SELECTION],
            function(err, result) {
                if (err) {
                    next(err);
                } else {
                    next(null, result);
                }
            });
    },

    updatedIdeaState_go: function(id, next) {
        pool.query(
            'UPDATE ideas ' +
            'SET state = ? ' +
            'WHERE ideas.id = ? ' +
            'AND state = ? ' +
            'AND cancelled = FALSE;',
            [ideas.states.BEING_IMPLEMENTED, id, ideas.states.AWAITING_GO_NO_GO],
            function(err, result) {
                if (err) {
                    next(err);
                } else {
                    next(null, result);
                }
            });
    },

    updatedIdeaState_coaching: function(id, next) {
        pool.query(
            'UPDATE ideas ' +
            'SET state = ? ' +
            'WHERE ideas.id = ? ' +
            'AND state = ? ' +
            'AND cancelled = FALSE;',
            [ideas.states.AWAITING_GO_NO_GO, id, ideas.states.IN_COACHING_PHASE],
            function(err, result) {
                if (err) {
                    next(err);
                } else {
                    next(null, result);
                }
            });
    },

    classifyIdea: function(ideaID, strategyAlignment, offerType, market, technicalViability,
                           economicalViability, riskFactors, otherRequirements, next) {
        pool.query('UPDATE ideas SET state = ?, strategyAlignment = ?, offerType = ?, market = ?,' +
            ' technicalViability = ?, economicalViability = ?, riskFactors = ?, otherRequirements = ?' +
            ' WHERE id = ?',
            [ideas.states.AWAITING_EVALUATION, strategyAlignment, offerType,
                market, technicalViability, economicalViability, riskFactors,
                otherRequirements, ideaID,
            ],
            function(error, results) {
                if (error) {
                    console.error(error);
                    next(error);
                } else {
                    next(null, results);
                }
            });
    },

    blockUser: function(id, next) {
        pool.query(
            'UPDATE users ' +
            'SET blocked = 1 ' +
            'WHERE users.id = ?;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    unblockUser: function(id, next) {
        pool.query(
            'UPDATE users ' +
            'SET blocked = 0 ' +
            'WHERE users.id = ?;', [id], function(err, result) {
                if (typeof next === 'function')
                    next(result);
            });
    },

    saveDraft: function(user_id, title, description, teamIdeas, teamMembers,
                        uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources,
                        results, callback, next) {

        pool.query('INSERT INTO drafts' +
            ' (user_id, title, description, teamIdeas, teammembers, ' +
            'uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, results)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ' +
            'title = ?, ' +
            'description = ?, ' +
            'teamIdeas = ?, ' +
            'teammembers = ?, ' +
            'uncertaintyToSolve = ?, ' +
            'solutionTechnicalCompetence =?, ' +
            'techHumanResources = ?, ' +
            'results = ?;',
            [user_id, title, description, teamIdeas, teamMembers, uncertaintyToSolve,
                solutionTechnicalCompetence, techHumanResources, results, title, description, teamIdeas, teamMembers,
                uncertaintyToSolve, solutionTechnicalCompetence, techHumanResources, results],
            function(err, rows, fields) {
                callback(err);
            });
    },

    loadDraft: function(user_id, next) {

        pool.query('SELECT * FROM drafts WHERE drafts.user_id = ? ;',
            [user_id],
            function(err, result) {
                next(result);
            });
    },

    insertBMC: function(ideaID, keyPartners, keyActivities, keyResources, valuePropositions, costumerSegments, costumerRelationships, channels, costStructure,
                        revenueStreams, callback) {
        pool.query('INSERT INTO BMC' +
            ' (ideaID, keyPartners, keyActivities, keyResources, valuePropositions, costumerSegments, ' +
            ' costumerRelationships, channels, costStructure, revenueStreams)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ideaID, keyPartners, keyActivities, keyResources, valuePropositions, costumerSegments, costumerRelationships, channels, costStructure, revenueStreams],
            function(err, rows, fields) {
                callback(err);
            });
    },
};


