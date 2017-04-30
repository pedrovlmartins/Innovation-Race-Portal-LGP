const path = require('path');
const email = require(path.join(__base, 'lib', 'mailer'));
const EmailTemplate = require('email-templates').EmailTemplate;
const evaluationNotificationEmailTemplateDir =
  path.join(__base, 'views', 'emails', 'evaluationNotification');

var states = {
  DRAFT: 0,
  AWAITING_CLASSIFICATION: 1,
  BEING_CLASSIFIED: 2,
  AWAITING_EVALUATION: 3,
  AWAITING_SELECTION: 4,
  SELECTED: 5,
  IN_COACHING_PHASE: 6,
  AWAITING_GO_NO_GO: 7,
  BEING_IMPLEMENTED: 8,
  CANCELLED: -1,
};

var stateDescriptions = [
  'Draft State',
  'Awaiting classification',
  'Being classified',
  'Awaiting evaluation',
  'Awaiting selection',
  'Selected',
  'In coaching phase',
  'Awaiting GO / NO GO',
  'Being implemented',
  'Cancelled',
];

module.exports = {
  states: states,

  getStateName: function  (stateNum, cancelled) {
    if (cancelled === true)
      return stateDescriptions[stateDescriptions.length - 1]
    if (stateNum < 0 || stateNum >= (stateDescriptions.length - 1))
      return null;
    return stateDescriptions[stateNum];
  },

  canSubmitIdea: function (user, race) {
    // TODO
    return true;
  },

  sendEvaluationNotificationEmail: function (to, ideaName, approved, callback) {
    var newsletter = new EmailTemplate(evaluationNotificationEmailTemplateDir);
    var data = {
      ideaName: ideaName,
      approved: approved,
      replyTo: 'altran@musaic.ml',
    };
    newsletter.render(data, function (err, result) {
      if (err) console.error(err);
      email.send(to,
        'Innovation Race Portal - Your idea has been evaluated by the technical directors',
        result.text, result.html,
        function (error, body) {
          callback(error, body);
        });
    });
  },

  sendSelectionNotificationEmail: function (to, ideaName, selected, callback) {
    var newsletter = new EmailTemplate(selectionNotificationEmailTemplateDir);
    var data = {
      ideaName: ideaName,
      selected: selected,
      replyTo: 'altran@musaic.ml',
    };
    newsletter.render(data, function (err, result) {
      if (err) console.error(err);
      email.send(to,
        'Innovation Race Portal - Your idea has been analyzed by the committee',
        result.text, result.html,
        function (error, body) {
          callback(error, body);
        });
    });
  },
};

