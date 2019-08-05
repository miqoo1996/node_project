var settings = require('./configs/main.js');
var users = require('./modules/users.js');
var app = settings.express();

app.get('/', users.allMiddleware, function(req, res) {
    res.locals = {
        title: 'Home',
        keywords: 'admin home, admin panel',
        description: 'Admin Home Page',
        styleTheme: 'main'
    };

    res.render('home', {

    });
});

require('./auth.js')(app, users, settings);
require('./a1.js')(app, users, settings);
require('./admin/app.js')(app, users, settings);