var express = require("express"),
 bodyParser = require("body-parser"),
 cookieParser = require('cookie-parser'),
 mongoose = require('mongoose'),
 exphbs = require('express-handlebars'), 
 morgan = require('morgan'),
 session = require('express-session'),
 passport = require('passport'),
 LocalStrategy = require('passport-local'),
 mongoStore = require('connect-mongo')(session),
 app = express(),
 router = express.Router();

//connect to database teech in mongo server
mongoose.connect('mongodb://localhost:27017/teech');

//using middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	store: new mongoStore({mongooseConnection:mongoose.connection}),
	secret: 'secretkey',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*app.post('/login', passport.authenticate('local-signin'),{
	successRedirect:'/successAuthenticate',
	failureRedirect:'/failedAuthenticate',
});*/

app.get('/failedAuthenticate', function(req,res){
	res.send("failed");
});

app.get('/successAuthenticate', function(req,res){
	res.send(req.user);
});

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});


app.use('/lib', express.static('lib'));

//serve the index file in the first 
router.get('/', function(req,res){
	res.sendFile(__dirname + "/lib/index.html");
});


app.use('/', router);
app.listen(1337);
console.log("walla");
