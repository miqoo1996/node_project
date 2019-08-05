module.exports = function(app, users, settings) {
    users.setSettings(settings);

    app.get('/admin', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Home Page',
            keywords: 'home, project',
            description: 'Home page'
        };

        res.render('home', {

        });
    });

    app.get('/admin/settings', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Settings',
            keywords: 'settings, project',
            description: 'settings'
        };

        res.render('settings', {

        });
    });

    app.get('/admin/profile', users.isAdminMiddleware, function(req, res) {
        res.locals = {
            title: 'Profile',
            keywords: 'profile, project',
            description: 'profile'
        };

        var user = req.user;

        res.render('profile', {
            user : user
        });
    });

    require('./users.js')(app, users, settings);
};