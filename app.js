/**
 * @desc: This is the server for h5maker
*/
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var ejs = require('ejs')
var favicon = require('express-favicon')
var config = require('./config')
var routers = require('./routers')
mongoose.Promise = require('bluebird')

// Connect to db
mongoose.connect(config.mongo.uri, {
    user: config.mongo.user,
    pass: config.mongo.pass
})
mongoose.connection.on('error', function (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
})

var app = express()

// view engine setup
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.send(200); // 让options请求快速返回
    } else {
        next();
    }
});

// Set favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set logger
app.use(logger('dev'))

// Parse request body
app.use(bodyParser.json({
    'limit': '2000kb'
}))
app.use(bodyParser.urlencoded({
    extended: false
}))

// Parse cookie
app.use(cookieParser())

// Set static direcotry
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'webapp/dist')))

// Load routers
routers(app)

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.send(err.message)
});

module.exports = app
