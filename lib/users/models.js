define([],function(){

	var User = Backbone.Model.extend({

		urlRoot:"/users",

		idAttribute:"_id",

		defaults: function(){
			return{
				username:"",
				password:"",
				status:"",
				rating:0,
				pictureurl:"",
				mail:"",
			}
		},

	});

	return {User:User}
});
