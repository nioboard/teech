requirejs.config({
	paths:{
		"text":"bower_components/requirejs-text/text",
	}
});

require(['users/models','users/views'], function(models,views){
	
	var currentUser,
	userList = models.UserList;

	var Router = Backbone.Router.extend({
		routes:{
			"":"home",
			"login":"login",
			"register":"register",
		},

		home: function(){

			//get the user  current user from server and initiate the navbar
			$.post('/currentUser', function(data){
				if (data){
					var currentUser = new models.User({_id:data});
					currentUser.fetch({success:function(){
						var nav = new views.nav({el:$('nav'), model:currentUser}).render();
					}});
				}
				else
					var nav = new views.nav({el:$('nav')}).render();

			});				
		},

		login: function(){
			var view = new views.login({el:$('main')}).render();
		},

		register: function(){

			var view = new views.login.render();
		},

	});

	var router = new Router();
	Backbone.history.start();

});
