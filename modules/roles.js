var settings = require("../configs/main.js");
var mysql = settings.mysql;

module.exports = {
    checkRole: function(roleId) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT count(*) as count FROM roles where id=?", [roleId], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }
                var count = typeof result[0]['count'] === "number" ? result[0]['count'] : 0;
                resolve(count);
            })
        });

        return promise;
    },
    checkUserRole: function (userId, role) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT COUNT(*) AS count FROM `user_roles` ur LEFT JOIN `roles` r  ON ur.`role_id` = r.`id` WHERE ur.`user_id`=? AND r.name=?", [userId, role], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }
                var count = typeof result[0]['count'] === "number" ? result[0]['count'] : 0;
                resolve(count);
            })
        });

        return promise;
    },
    findAll: function (dropdownList) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT * FROM roles", [], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }

                var roles = {};
                if (typeof dropdownList !== 'undefined' && dropdownList) {
                    for (var i in result) {
                        roles[result[i].id] = result[i].name;
                    }
                } else {
                    roles = result;
                }
                resolve(roles);
            });
        });

        return promise;
    },
    findAllByGroup: function (dropdownList, group, id) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT r.* FROM `role_groups`  g LEFT JOIN `roles` r ON g.`id`=r.`role_gropup_id` WHERE g.`name`=?", [group], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }

                var roles = {};
                if (typeof dropdownList !== 'undefined' && dropdownList) {
                    for (var i in result) {
                        roles[result[i].id] = result[i].name;
                    }
                } else {
                    roles = result;
                }
                resolve(roles);
            });
        });

        return promise;
    },
    findRolesByGroupId: function(dropdownList, id) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("SELECT r.* FROM `roles` r LEFT JOIN `role_groups` rg ON r.`role_gropup_id`=rg.`id` WHERE r.`role_gropup_id`= ?", [id], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }

                var roles = {};
                if (typeof dropdownList !== 'undefined' && dropdownList) {
                    for (var i in result) {
                        roles[result[i].id] = result[i].name;
                    }
                } else {
                    roles = result;
                }
                resolve(roles);
            });
        });

        return promise;
    },
    findRoleGroups: function(dropdownList) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("Select * from `role_groups`", function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }

                var roles = {};
                if (typeof dropdownList !== 'undefined' && dropdownList) {
                    for (var i in result) {
                        roles[result[i].id] = result[i].name;
                    }
                } else {
                    roles = result;
                }
                resolve(roles);
            });
        });

        return promise;
    },
    saveUserRole: function(userId, roleId) {
        var promise = new Promise(function(resolve, reject) {
            mysql.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [userId, roleId], function (err, result) {
                if (err) {
                    reject(err);
                    throw err;
                }
                if (result.affectedRows) {
                    resolve('ok');
                } else {
                    resolve('fail');
                }
            });
        });

        return promise;
    }
};