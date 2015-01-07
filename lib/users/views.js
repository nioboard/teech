define(['users/models','text!./home.html'],function(users,home_tmpl){
	
	var Home = Backbone.View.extend({

		initialize: function(){
		},

		render: function(){
			this.$el.html(home_tmpl);
		},
		
	});

	return{home:Home}
});