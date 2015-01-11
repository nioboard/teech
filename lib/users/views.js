define(['users/models',
	'text!./login.html',
	'text!./navbar.html'],function(models,login_tmpl,nav_tmpl){
	
//TO-DO: change the signup proccess to seperate view;


	var login = Backbone.View.extend({

		events:{
			"click #signin":"signin",
			"click #signup":"signup",
		},



		initialize: function(){

		},

		render: function(){
			this.$el.html(login_tmpl);
		},

		signin: function(e){
			//prevent default bootstrap behaver	
			e.preventDefault();

			var username = this.$('#email').val();
			var password = this.$('#password').val();


			$.post('/login',{username:username ,password:password},function(data){
				if(typeof data == 'object'){
					window.location.hash ="";
					window.location.reload();
				}
				else
					console.log(data);
			});
		},

		//move this process to seperate view
		signup: function(e){
			e.preventDefault();

			var username = this.$('#email').val();
			var password = this.$('#password').val();


			$.post('/signup',{username:username ,password:password},function(data){
				if(typeof data == 'object'){
					window.location.hash ="";
					window.location.reload();
				}
				else
					console.log("this username is already exist");
			});

		},
		
	});

	var nav = Backbone.View.extend({

		template: Handlebars.compile(nav_tmpl),

		render: function(){
			this.$el.html(this.template({user:this.model}));
		},
	});

	return{login:login, nav:nav}
});