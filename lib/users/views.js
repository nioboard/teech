define(['users/models','text!./home.html'],function(models,home_tmpl){
	
	var Home = Backbone.View.extend({

		events:{
			"click #signin":"signin"
		},



		initialize: function(){

		},

		render: function(){
			this.$el.html(home_tmpl);
		},

		signin: function(e){
			//prevent default bootstrap behaver	
			e.preventDefault();

			var username = this.$('#username').val();
			var password = this.$('#password').val();

			$.post('/login',{username:username ,password:password},function(data){
				if(typeof data == 'object')
					console.log('hello ' + data.username + " you have succefully logedin");
				else
					console.log(data);
			});
		},
		
	});

	return{home:Home}
});