requirejs.config({
	paths:{
		"text":"bower_components/requirejs-text/text",
	}
});

require(['users/models','users/views'], function(models,views){

	var userList = models.UserList;

	var Router = Backbone.Router.extend({
		routes:{
			"":"home",
			"register":"register",
		},

		home: function(){
			userList.create({username:'nir', password:'123456'});
			var view = new views.home({el:$('main')}).render();
		},

		register: function(){

			var view = new views.login.render();
		},

	});

	var router = new Router();
	Backbone.history.start();

});
