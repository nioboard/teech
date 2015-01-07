requirejs.config({
	paths:{
		"text":"bower_components/requirejs-text/text",
	}
});

require(['users/models','users/views'], function(user,views){


	var Router = Backbone.Router.extend({
		routes:{
			"":"home",
			"login":"login",
		},

		home: function(){
			var view = new views.home({el:$('main')}).render();
		},

		login: function(){

			var view = new views.login.render();
		},

	});

	var router = new Router();
	Backbone.history.start();

});
