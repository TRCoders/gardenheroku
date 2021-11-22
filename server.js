let express  = require('express');
let app      = express();
let port     = process.env.PORT || 9000;
let MongoClient = require('mongodb').MongoClient
let mongoose = require('mongoose');
let passport = require('passport');
let flash    = require('connect-flash');
let ObjectId = require('mongodb').ObjectId
let multer = require('multer')
const imageModel = require('./model');

let morgan       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let session      = require('express-session');

let configDB = require('./config/database.js');

let db;

require('dotenv/config');

mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/routes.js')(app, passport, db, multer, ObjectId);
}); // connectd to the database

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs');
app.use(session({
    secret: 'gardenedentheseconded', // secret garden session
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Launch Port
app.listen(port);
console.log('Port online. Go to port number ' + port);