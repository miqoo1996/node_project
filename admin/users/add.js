var eventEmitter = require('events');
var roles = require('../../modules/roles.js');
var Form = require('form-builder').Form;
var emitter = new eventEmitter();

module.exports = function(app, users, settings) {
    users.setSettings(settings);
    users.formName = 'User';

    users._isPostReq = false;

    app.get('/admin/user/add', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Add User',
            keywords: 'add user, project',
            description: 'Add user'
        };

        var userRolesPromise = roles.findRoleGroups(true);

        var failForm = req.param('failForm');
        var userExist = req.param('userExist');
        var userRoleNotExist = req.param('userRoleNotExist');

        Promise.all([userRolesPromise]).then(function(values) {
            userRoles = values[0];
            res.render('user/add', {
                Form: Form,
                _isPostReq: users._isPostReq,
                failForm: failForm,
                roles: userRoles,
                userExist: userExist,
                userRoleNotExist: userRoleNotExist
            });

            // setting request metod type
            users._isPostReq = false;
        });
    });

    app.post('/admin/user/add', users.isAdminMiddleware, function(req, res) {
        users._isPostReq = true;

        var isRegistread = users.register(req.body, emitter, function(status) {

        });

        var userExist = 0;
        var userRoleNotExist = 0;

        emitter.on('userform:validation:status:user-exist', function() {
            userExist = 1;
        });

        emitter.on('userform:validation:status:user-role-not-exist', function() {
            userRoleNotExist = 1;
        });

        res.redirect('/admin/user/add?failForm=' + (isRegistread ? 0 : 1) + '&userExist=' + userExist + '&userRoleNotExist=' + userRoleNotExist);
    });
};