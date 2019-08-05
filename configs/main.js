var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var express = require('express');
var app = express();

var serverConfig = exports;
var config = {
    host: 'node_project.test',
    //host: 'http://node_project.test',
    port: process.env.PORT || 8000,
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'node_project'
    },
    view: {
        path: 'views',
        pathForAdmin: 'admin/views'
    }
};

var mysqlCon = mysql.createConnection(config.mysql);
var sessionStore = new MySQLStore({}, mysqlCon);

serverConfig.getExpressInstance = function() {
  return express;
};

serverConfig.getSessionStore = function() {
  return sessionStore;
};

// admin views path setting
serverConfig.setView = function (view) {
    app.set('views', view);
    return app;
};

serverConfig.express = function () {
    app.set('view engine', 'ejs');
    app.set('layout extractScripts', true);
    app.set('layout extractStyles', true);
    app.set('views', config.view.path);

    app.use(expressLayouts);
    app.use(express.static('client/public'));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(session({
        secret: 'secret-96e79218965eb72c92a549dd5a330112',
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
    app.use(function(req, res, next) {
        if (typeof req.session.userIsGuest !== 'boolean') {
            req.session.userIsGuest = true;
        }
        this.session = req.session;
        return next();
    });

    app.engine('html', require('ejs').renderFile);

    app.listen(config.port, config.host, function() {
        console.log('Server running...');
    });

    return app;
};

serverConfig.mysql = mysqlCon;
serverConfig.config = config;
