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

  currentIsManager: function (req) {
        return currentUserID(req) && users.isManager(currentUserType(req));
    },
  currentCanSelectIdea: function (req) {
    var type = currentUserType(req);
    return currentUserID(req) && (type == users.types.COMMITTEE || type == users.types.MANAGER);
  },

  currentCanEvaluateIdea: function (req) {
    var type = currentUserType(req);
    return currentUserID(req) && (type == users.types.TECHNICAL_DIRECTOR || type == users.types.MANAGER);
  },

    currentCanChangeUserType: function (req) {
        var type = currentUserType(req);
        return currentUserID(req) && ( type == users.types.MANAGER);
    },

  currentCanGoIdea: function (req) {
    var type = currentUserType(req);
    return currentUserID(req) && (type == users.types.MANAGER);
  },

  mergeRecursive: function (obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);

        } else {
          obj1[p] = obj2[p];

        }

      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];

      }
    };

    return obj1;
  },
};
