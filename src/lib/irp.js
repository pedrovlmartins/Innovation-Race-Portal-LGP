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
};
