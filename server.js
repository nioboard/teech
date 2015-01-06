var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router.get('/', function(req,res){
	res.sendFile(__dirname + "/src/index.html");
});


app.use('/', router);
app.listen(1337);
console.log("walla");
