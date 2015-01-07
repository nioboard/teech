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
 User = require("mongo-models/User");
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
//app.use(morgan('combined'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.post('/login', passport.authenticate('local',{
	successRedirect:'/successAuthenticate',
	failureRedirect:'/failedAuthenticate',
	})
);

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

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('-1')
	  	process.nextTick(function() {
	  		console.log('0');
		  	User.findOne({'username':username}, function(err, user){
		  		if(err){
		  			console.log('1');
		  			return done(err)
		  		}
		  		if(!user){
		  			console.log('2');
		  			return done(null,false);
		  		}
		  		if(user.password != password){
		  			console.log('3');
		  			return done(null,false);
		  		}
		  		//make sure explicitly password is match
		  		if(user.password == password){
		  			console.log('4');
		  			return done(null,user);
		  		}
	  	});
    
    });
}));


app.use('/lib', express.static(	'lib'));

//serve the index file in the first 
router.get('/', function(req,res){
	res.sendFile(__dirname + "/lib/index.html");
});

router.route("/users")

	.post(function(req,res){
		var user = new User({
			username: req.body.username,
			password: req.body.password,
		}).save(function(err){
			if(err)
				res.send(err);
			res.json(user);
		});
	})

	.get(function(req,res){
		User.find(function(err,users){
			if(err)
				res.send(err)
			res.json(users);
		});
	});


	router.route('/users/:user_id')

		.get(function(req, res){
			User.findById(req.params.user_id, function(err, user){
				if(err)
					res.send(err);
				res.json(user);
			});
		})

		.put(function(req, res){
			console.log(req.body);
			User.findById(req.params.user_id, function(err, user){
				if(err)
					res.send(err)
				if(user){
					user.mail = req.body.mail;
					user.password = req.body.password;
				}
			});
		});


app.use('/', router);
app.listen(1337);
console.log("walla");
