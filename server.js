var express = require("express"),
 bodyParser = require("body-parser"),
 mongoose = require('mongoose'),
 exphbs = require('express-handlebars'), 
 morgan = require('morgan'),
 app = express(),
 router = express.Router();

//connect to database, teech in mongo server
mongoose.connect('mongodb://localhost:27017/teech');

//uing express bodyparser to parse http requests and responsw
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/lib', express.static('lib'));

//serve the index file in the first 
router.get('/', function(req,res){
	res.sendFile(__dirname + "/lib/index.html");
});


app.use('/', router);
app.listen(1337);
console.log("walla");
