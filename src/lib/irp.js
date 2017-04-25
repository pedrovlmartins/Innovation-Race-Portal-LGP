const path = require('path');
const users = require(path.join(__base, 'lib', 'users'));

function currentUserID(req) {
  return req.session.userID;
}

function currentUserType(req) {
  return req.session.userType;
}

module.exports = {
  addError: function (req, msg) {
    req.session.errorMessages = req.session.errorMessages || [];
    req.session.errorMessages.push(msg);
  },

  addSuccess: function (req, msg) {
    req.session.successMessages = req.session.successMessages || [];
    req.session.successMessages.push(msg);
  },

  getActionResults: function (req) {
    return {
      errorMessages: req.session.errorMessages || [],
      successMessages: req.session.successMessages || [],
    };
  },

  cleanActionResults: function (req) {
    req.session.errorMessages = [];
    req.session.successMessages = [];
  },

  currentUserID: currentUserID,

  currentUserType: currentUserType,

  currentIsParticipant: function (req) {
    return currentUserID(req) && users.isParticipant(currentUserType(req));
  },

  currentCanSelectIdea: function (req) {
    var type = currentUserType(req);
    return currentUserID(req) && (type == users.types.COMMITTEE || type == users.types.MANAGER);
  },
};
