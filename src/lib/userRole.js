module.exports = {
    getRoleName: function  (roleNum)
    {
        var role = parseInt(roleNum);
        switch (role) {
            case 0:
                return 'Altran Employee';
            case 1:
                return 'Altran Partner';
            case 2:
                return 'Altran Client';
            default:
                return 'Invalid role';
        }
    },
};