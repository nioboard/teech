define([],function(){

	var User = Backbone.Model.extend({

		urlRoot:"/users",

		idAttribute:"_id",

		defaults: function(){
			return{
				givenName:"",
				familyName:"",
				password:"",
				status:"",
				rating:0,
				photo:"",
				email:"",
			}
		},

	});

	var Users = Backbone.Collection.extend({
		model: User,
		url:User.prototype.urlRoot,
		

	});

	var UserList = new Users();

	return {
			User:User,
			UserList:UserList 
			}
});
