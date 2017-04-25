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
]

module.exports = {
  getStateName: function  (stateNum)
  {
    if (stateNum < 0 || stateNum >= stateDescriptions.length)
      return null;
    return stateDescriptions[stateNum];
  },

};

