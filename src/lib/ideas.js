module.exports = {
  getStateName: function (stateNum)
  {
    switch (stateNum) {
      case 0:
        return 'Draft State';
      case 1:
        return 'Awating classification';
      case 2:
        return 'Being classified';
      case 3:
        return 'Awating evaluation';
      case 4:
        return 'Awaiting selection';
      case 5:
        return 'Selected';
      case 6:
        return 'During coaching';
      case 7:
        return 'Awating GO/NO GO';
      case 8:
        return 'Being implemented';
      default:
        return 'Invalid state';
    }
  },
};

