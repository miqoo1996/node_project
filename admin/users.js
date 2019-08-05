module.exports = function(app, users, settings) {
    users.setSettings(settings);

    app.get('/admin/user/add', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Add User',
            keywords: 'add user, project',
            description: 'Add user'
        };

        res.render('user/add', {

        });
    });

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
};