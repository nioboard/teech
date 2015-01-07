var mongoose = require('mongoose');

var User = new mongoose.Schema({
	username:String,
	password:String,
	status:String,
	rating:Number,
	pictrureurl:String,
	mail:String,

});
module.exports = mongoose.model("User", User);