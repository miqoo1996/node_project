var md5 = require('md5');
var roles = require('./roles.js');
var validation = require('./MValidation');
var settings = require("../configs/main.js");
var sessionStore = settings.getSessionStore();
var mysql = settings.mysql;

module.exports = {
    settings: null,
    roleModel: null,
    formName: 'Registration',
    setRoleModel: function (model) {
        this.roleModel = model;
    },
    setSettings: function (settings) {
        this.settings = settings;
    },
    isValidate: function (data, form) {
        switch (form) {
            case 'register':
                if (validation.isEmail(data[this.formName + '[email]'])
                    && validation.between([data[this.formName + '[username]'], data[this.formName + '[password]']], 6, 60)
                    && validation.between([data[this.formName + '[firstname]'], data[this.formName + '[lastname]']], 3, 255)
                    && validation.isValidate(data[this.formName + '[username]'], /^[a-zA-Z0-9]+$/i)
                    && validation.isValidate(data[this.formName + '[firstname]'], /^[A-Z\s]+$/i)
                    && validation.isValidate(data[this.formName + '[lastname]'], /^[A-Z\s]+$/i)
                    && validation.isset(data[this.formName + '[role]'])
                    && validation.confirm(data[this.formName + '[password]'], data[this.formName + '[confirm-password]'])) {
                    return true;
                }
                break;
            case 'login':
                if (validation.between([data['Login[username]'], data['Login[password]']], 6, 60)
                    && validation.isValidate(data['Login[username]'], /^[a-zA-Z0-9]+$/i)) {
                    if (validation.isset(data['Login[remember]']) && data['Login[remember]'] == 1) {
                        // remember me
                    }
                    return true;
                }
                break;
            case 'recovery':
                if (validation.isEmail(data['Recovery[email]'])) {
                    return true;
                }
                break;
            default:
                console.log('form data: ', data);
        }
        return false;
    },
    register: function (data, emitter, callback) {
        var _self = this;
        if (this.isValidate(data, 'register')) {
            var saveData = {
                firstname: data[this.formName + '[firstname]'],
                lastname: data[this.formName + '[lastname]'],
                email: data[this.formName + '[email]'],
                username: data[this.formName + '[username]'],
                password: md5(data[this.formName + '[password]'])
            };

            var roleId = data[this.formName + '[role]'];
            var userRoleCheckPromise = this.roleModel.checkRole(roleId);
            userRoleCheckPromise.then(function(count) {
                if (!count) {
                    var status = 'user-role-not-exist';
                    emitter.emit('userform:validation:status:' + status);
                } else {
                    _self.create(saveData, function(status, user) {
                        _self.roleModel.saveUserRole(user.id, roleId);
                        emitter.emit('userform:validation:status:' + status);
                        if (typeof callback === 'function') {
                            callback(status, user);
                            return true;
                        }
                    });
                }
            });
        } else {
            callback('fail')
        }
        return false;
    },
    login: function (data, emitter, callback) {
        if (this.isValidate(data, 'login')) {
            var sendData = data;
            sendData.username = data['Login[username]'];
            sendData.password = md5(data['Login[password]']);
            this.findByUsernamePassword(sendData, function (user) {
                var status = 'ok';
                if (user) {
                    emitter.emit('userform:validation:status:' + status);
                    if (typeof callback === 'function') {
                        callback(status, user);
                    }
                } else {
                    status = 'login-fail';
                    emitter.emit('userform:validation:status:' + status);
                    if (typeof callback === 'function') {
                        callback(status, user);
                    }
                }
            });
        } else {
            callback('fail')
        }
    },
    recovery: function (data, emitter, callback) {
        if (this.isValidate(data, 'recovery')) {
            var sendData = data;
            sendData.email = data['Recovery[email]'];
            this.findOne(sendData, function (user) {
                if (user) {
                    var status = 'ok';
                    emitter.emit('userform:validation:status:' + status);
                    if (typeof callback === 'function') {
                        callback(status);
                    }
                } else {
                    status = 'recovery-fail';
                    emitter.emit('userform:validation:status:' + status);
                    if (typeof callback === 'function') {
                        callback(status);
                    }
                }
            });
        } else {
            callback('fail')
        }
    },
    authenticate: function (session, user, beforeAuthenticate) {
        session.user = user;
        session.userIsGuest = false;
        if (typeof beforeAuthenticate === 'function') {
            beforeAuthenticate();
        }
    },
    isLoggedIn: function (session) {
       try {
           isLoggedIn = typeof session.userIsGuest === 'boolean' && session.userIsGuest === false;
           return isLoggedIn;
       } catch (e) {
           return false;
       }
    },
    allMiddleware: function (req, res, next) {
        module.exports.settings.setView(module.exports.settings.config.view.path);
        return next();
    },
    isLoggedInMiddleware: function (req, res, next) {
        sessionStore.get(req.sessionID, function (cb, data) {
            // if user is authenticated in the session, carry on
            if (module.exports.isLoggedIn(data)) {
                req.userIsGuest = false;
                req.user = data.user;
                module.exports.settings.setView(module.exports.settings.config.view.path);
                return next();
            }
            // if they aren't redirect them to the login page
            res.redirect('/login');
        });
    },
    isAdminMiddleware: function (req, res, next) {
        sessionStore.get(req.sessionID, function (cb, data) {
            // if user is authenticated in the session, carry on
            if (module.exports.isLoggedIn(data)) {
                req.userIsGuest = false;
                req.user = data.user;
                var checkUserRolePromise = roles.checkUserRole(req.user.id, 'admin');
                checkUserRolePromise.then(function(count) {
                    if (count) {
                        if (/^\/admin/.test(req.url)) {
                            module.exports.settings.setView(module.exports.settings.config.view.pathForAdmin);
                        } else {
                            module.exports.settings.setView(module.exports.settings.config.view.path);
                        }
                        return next();
                    } else {
                        // if they aren't redirect them to the login page
                        res.redirect('/login');
                    }
                });
            } else {
                // if they aren't redirect them to the login page
                res.redirect('/login');
            }
        });
    },
    isGuestMiddleware: function (req, res, next) {
        sessionStore.get(req.sessionID, function (cb, data) {
            // if user is authenticated in the session, carry on
            if (!module.exports.isLoggedIn(data)) {
                req.userIsGuest = true;
                module.exports.settings.setView(module.exports.settings.config.view.path);
                return next();
            }

            // if they aren't redirect them to the profile page
            res.redirect('/profile');
        });
    },
    findOne: function (data, callback) {
        var email = validation.isset(data.email) ? data.email : '--';
        var username = validation.isset(data.username) ? data.username : '--';
        mysql.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], function (err, result) {
            if (err) {
                throw err;
            }
            var user = null;
            if (result.length) {
                user = result[0];
            }
            callback(user);
        });
    },
    findAll: function () {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT u.*, r.`name` AS role_name FROM `user_roles` ur LEFT JOIN `users` u ON ur.`user_id`=u.`id` LEFT JOIN `roles` r ON ur.`role_id`=r.`id` ORDER BY u.`created_at` DESC", [], function (err, result) {
                if (err) {
                    throw err;
                }
                resolve(result);
            });
        });

        return promise;
    },
    findByUsernamePassword: function(data, callback) {
        mysql.query("SELECT * FROM users WHERE password = ? AND username = ?", [data.password, data.username], function (err, result) {
            if (err) {
                throw err;
            }
            var user = null;
            if (result.length) {
                user = result[0];
            }
            callback(user);
        });
    },
    create: function (data, callback) {
        this.findOne(data, function (user) {
            if (user === null) {
                mysql.query("INSERT INTO users (firstname, lastname, email, username, password) VALUES (?, ?, ?, ?, ?)", [
                        data.firstname, data.lastname, data.email, data.username, data.password
                    ],
                    function (err, result) {
                        if (err) {
                            throw err;
                        }
                        if (result.affectedRows) {
                            module.exports.findOne(data, function (userInserted) {
                                callback('ok', userInserted);
                            });
                        }
                    });
            } else {
                callback('user-exist', user);
            }
        });
    }
};