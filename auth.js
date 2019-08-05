var eventEmitter = require('events');
var roles = require('./modules/roles.js');
var Form = require('form-builder').Form;
var emitter = new eventEmitter();

module.exports = function(app, users, settings) {
    users.setRoleModel(roles);
    users.setSettings(settings);

    app.all('/register', users.isGuestMiddleware, function(req, res) {
        res.locals = {
            title: 'Registration',
            keywords: 'register, project',
            description: 'Registration page',
            styleTheme: 'default'
        };

        var userRolesPromise = roles.findAllByGroup(true, 'user');

        var render = function() {
            userRolesPromise.then(function(userRoles) {
                res.render('auth/user-log-req-reg', {
                    Form: Form,
                    userRoles: userRoles,
                    showRegisterForm: true
                });
            });
        };

        if (req.method == 'POST') {
            users.register(req.body, emitter, function(status, user) {
                if (user && status == 'ok') {
                    users.authenticate(session, user, function() {
                        res.redirect('/profile');
                    });
                } else {
                    render();
                }
            });

            res.locals.userExist = false;
            emitter.on('userform:validation:status:user-exist', function() {
                res.locals.userExist = true;
                render();
            });

            emitter.on('userform:validation:status:user-role-not-exist', function() {
                res.locals.userRoleNotExist = true;
                render();
            });
        } else {
            render();
        }
    });

    app.all('/login', users.isGuestMiddleware, function(req, res) {
        res.locals = {
            title: 'Login',
            keywords: 'login, project',
            description: 'Login page',
            styleTheme: 'default'
        };

        var userRoles = roles.findAll(true);

        var render = function () {
            res.render('auth/user-log-req-reg', {
                Form: Form,
                userRoles: userRoles,
                showLoginForm: true
            });
        };

        var session = req.session;
        res.locals.loginFail = false;

        if (req.method == 'POST') {
            users.login(req.body, emitter, function(status, user) {
                if (user && status == 'ok') {
                    users.authenticate(session, user, function() {
                        var checkUserRolePromise = roles.checkUserRole(user.id, 'admin');
                        checkUserRolePromise.then(function(count) {
                            if (count) {
                                res.redirect('/admin');
                            } else {
                                res.redirect('/profile');
                            }
                        });
                    });
                } else {
                    render();
                }
            });

            emitter.on('userform:validation:status:login-fail', function() {
                res.locals.loginFail = true;
                render();
            });
        } else {
            render();
        }
    });

    app.get('/logout', users.isLoggedInMiddleware, function(req, res) {
        // destroy the user's session to log them out
        // will be re-created next request
        req.session.destroy(function() {
            res.redirect('/');
        });
    });

    app.all('/password/recovery', users.isGuestMiddleware, function(req, res) {
        res.locals = {
            title: 'Forgot password',
            keywords: 'recover, forgot password, project',
            description: 'Forgot password',
            styleTheme: 'default'
        };

        var userRoles = roles.findAll(true);

        var render = function() {
            res.render('auth/user-log-req-reg', {
                Form: Form,
                userRoles: userRoles,
                showForgotPassForm: true
            });
        };

        res.locals.recoveryFail = false;

        if (req.method == 'POST') {
            users.recovery(req.body, emitter, function(status) {
                if (status != 'ok') {
                    render();
                }
            });

            emitter.on('userform:validation:status:recovery-fail', function() {
                res.locals.recoveryFail = true;
                render();
            });

            emitter.on('userform:validation:status:ok', function() {

            });
        } else {
            render();
        }
    });

    app.get('/profile', users.isLoggedInMiddleware, function(req, res) {
        res.locals = {
            title: 'Profile',
            keywords: 'Profile, project',
            description: 'Profile page',
            styleTheme: 'default'
        };

        var user = req.user;

        res.render('profile', {
            user : user
        });
    });
};