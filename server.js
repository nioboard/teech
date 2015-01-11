	var express = require("express"),
 bodyParser = require("body-parser"),
 cookieParser = require('cookie-parser'),
 mongoose = require('mongoose'),
 exphbs = require('express-handlebars'), 
 morgan = require('morgan'),
 session = require('express-session'),
 passport = require('passport'),
 LocalStrategy = require('passport-local'),
 FbStrategy = require('passport-facebook'),
 mongoStore = require('connect-mongo')(session),
 User = require("mongo-models/User"),
 oauthConfig = require('./oauth'),
 app = express(),
 router = express.Router();

//connect to database teech in mongo server
mongoose.connect('mongodb://localhost:27017/teech');

//parsing/session/authenticate/render midlewares
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


//log-in first route
app.post('/login', passport.authenticate('local-signin',{
	successRedirect:'/successAuthenticate',
	failureRedirect:'/failedAuthenticate',
	})
);


//registration first route
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/successAuthenticate',
  failureRedirect: '/failedAuthenticate',
	})
);

 app.get('/auth/facebook-authentication', passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/failedAuthenticate'
        }));


//redirect to if local-authenticate is failed
app.get('/failedAuthenticate', function(req,res){
	res.send("failed");
});



//redirect to if local-authentication success
app.get('/successAuthenticate', function(req,res){
	res.send(req.user);
});


//log-out route, remove the session from req and redirect to home
app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});


//serialiaze the user to the session
passport.serializeUser(function(user, done) {
  done(null, user);
});


//deserialize user from the session 
passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use('local-signup', new LocalStrategy(
	function(username, password, done){
		process.nextTick(function() {
			User.findOne({'email':username}, function(err, user){
				if(err)
					return done(err)
				if(user)
					return done(null,false)
				if(!user){
					var user = new User({email:username, password:password})
					.save(function(err, user){
						if(err)
							return done(err);
						return done(null, user);
					});
				}
			});
		});
	}
));

//local-authentication strategy
passport.use('local-signin',new LocalStrategy(
	function(username, password, done) {
	  	process.nextTick(function() {
		  	User.findOne({'email':username}, function(err, user){
		  		if(err)
		  			return done(err);
		  		if(!user)
		  			return done(null,false);
		  		if(user.password != password)
		  			return done(null,false);
		  
		  		//make sure explicitly password is match
		  		if(user.password == password)
		  			return done(null,user);

	  	});
    
    });
}));

//facebook-authentication strategy
passport.use(new FbStrategy({
	clientID : oauthConfig.facebook.clientID,
	clientSecret : oauthConfig.facebook.clientSecret,
	callbackURL : oauthConfig.facebook.callbackURL
}, 
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({'facebook.id': profile.id}, function(err, user){
				if (err)
					return done(err);
				if(user)
					return done(null, user);
				if(!user){
					//to-do: check if there is existing user with same email to avoid ambiguity
					var user = new User({
							'facebook':{
								'id':profile.id,
								'token':token,
								'name':  profile.name.givenName + ' ' + profile.name.familyName,
								'email': profile.emails[0].value,
								'picture': 'https://graph.facebook.com/' + profile.id + '/picture',
							},
							'givenName': profile.name.givenName,
							'familyName': profile.name.familyName,
							'email': profile.emails[0].value,
							'picture': 'https://graph.facebook.com/' + profile.id + '/picture',
					});
					user.save(function(err, user){
						if(err)
							return done(err);
						return done(null, user);
					});
				}
			})
		});
	}));




//serve source file
app.use('/lib', express.static(	'lib'));

//serve the index file in the first 
router.get('/', function(req,res){
	res.sendFile(__dirname + "/lib/index.html");
});

router.post('/currentUser', function(req,res){
	if(req.user)
		res.send(req.user._id);
	else
		res.send(false);
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
