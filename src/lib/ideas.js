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

};

