module.exports = {
  getRoleName: function  (roleNum)
  {
    switch (roleNum) {
      case 0:
        return 'Altrans Employee';
      case 1:
        return 'Altrans Partner';
      case 2:
        return 'Altrans Client';
      default:
        return 'Invalid role';
    }
  },
};
