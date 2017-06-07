var types = {
  ALTRAN_MEMBER: 1,
  PARTNER: 2,
  CLIENT: 3,
  MANAGER: 4,
  COMMITTEE: 5,
  TEAM: 6,
  TECHNICAL_DIRECTOR: 7,
};

var typeDescriptions = [
  'Unknown', // 0
  'Altran member', // 1
  'Partner', // 2
  'Client', // 3
  'R&D Manager', // 4
  'R&D Committee', // 5
  'R&D Team', // 6
  'Technical Director', // 7
];

module.exports = {
  types: types,

  getTypeDescription: function (typeNum)
  {
    if (typeNum < 0 || typeNum >= typeDescriptions.length)
      return null;
    return typeDescriptions[typeNum];
  },

  isParticipant: function (typeNum) {
    return typeNum === types.ALTRAN_MEMBER || typeNum === types.PARTNER || typeNum === types.CLIENT;
  },

  isAdmin: function (typeNum) {
    return typeNum === types.MANAGER || typeNum === types.COMMITTEE || typeNum === types.TEAM
      || typeNum === types.TECHNICAL_DIRECTOR;
  },

  isTechnicalDirector: function (typeNum) {
    return typeNum === types.TECHNICAL_DIRECTOR;
  },

  isManager: function (typeNum) {
    return typeNum === types.MANAGER;
  },
};