module.exports = {
  getRoleName: function  (roleNum)
  {
    switch (roleNum) {
      case 0:
        return 'Altran\'s Employee';
      case 1:
        return 'Altran\'s Partner';
      case 2:
        return 'Altran\'s Client';
      default:
        return 'Invalid state';
    }
  },
};
