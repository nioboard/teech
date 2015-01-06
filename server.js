var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var app = express();
var router = express.Router();

//connect to database, teech in mongo server
mongoose.connect('mongodb://localhost:27017/teech');

//uing express bodyparser to parse http requests and responsw
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//serve the index file in the first 
router.get('/', function(req,res){
	res.sendFile(__dirname + "/lib/index.html");
});


app.use('/', router);
app.listen(1337);
console.log("walla");
