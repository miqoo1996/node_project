module.exports = function(app, users, settings) {
    users.setSettings(settings);

    app.get('/a1', users.allMiddleware, function(req, res) {
        res.locals = {
            title: 'a1',
            keywords: 'a1',
            description: 'a1',
            styleTheme: 'main'
        };

        res.render('a1/index', {
            message: 'a1',
            message2: 'a2'
        });
    });
};