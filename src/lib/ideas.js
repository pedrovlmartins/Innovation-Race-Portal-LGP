const path = require('path');
const selectionNotificationEmailTemplateDir =
  path.join(__base, 'views', 'emails', 'selectionNotification');

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
];

module.exports = {
  states: states,

  getStateName: function  (stateNum)
  {
    if (stateNum < 0 || stateNum >= stateDescriptions.length)
      return null;
    return stateDescriptions[stateNum];
  },

  sendSelectionNotificationEmail: function (to, ideaName, selected, callback) {
    var newsletter = new EmailTemplate(selectionNotificationEmailTemplateDir);
    var data = {
      ideaName: ideaName,
      selected: selected,
      replyTo: 'altran@musaic.ml',
    };
    newsletter.render(user, function (err, result) {
      if (err) console.error(err);
      email.send(to, 'Innovation Race Portal - Your idea has been analyzed by the committee', result.text, result.html,
        function (error, body) {
          callback(error, body);
        });
    });
  },
};

