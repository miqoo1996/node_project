var roles = require('../../modules/roles.js');

module.exports = function(app, users, settings) {
    users.setSettings(settings);

    app.get('/admin/user/list', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Users List',
            keywords: 'user list, project',
            description: 'Users List'
        };

        users.findAll().then(function(usersList) {
            res.render('user/list', {
                usersList: usersList
            });
        });
    });

    app.post('/admin/user/get/roles', users.isAdminMiddleware, function(req, res) {
        var id = req.param('id');
        if (id && typeof id == 'string') {
            var userRolesPromise = roles.findRolesByGroupId(true, id);
            userRolesPromise.then(function(roles) {
                return res.send(roles);
            });
        } else {
            return res.send({});
        }
    });

    require('./add.js')(app, users, settings);
};