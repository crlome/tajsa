var router = Backbone.Router.extend({
	routes: {
		'' : 'index',
		':mod(/)': 'dynamic',
		//':mod/:id(/)': 'dynamic'
	},
	index: function() {
		console.log('---- INDEX ----');
		// try {
		//     app.ut.logging({info:null, tipo:'router', tipo_proc:'info', url:'index'});
		// }
		// catch(ex) {}

		app.currView.close();
	},
	dynamic: function(mod, id) {
		if(!mod)
			return null;

		var parts = mod.split('?');

		var url = parts[0];
		var params = Object();

		if(parts.length > 1) {
			var queryparams = parts[1].split('&');
			for (var i = 0; i < queryparams.length; i++) {
				var parparams = queryparams[i].split('=');
				if(parparams.length != 2)
					continue;

				params[parparams[0]] = parparams[1];
			}
		}
		// try {
		//     app.ut.logging({info:null, tipo:'router', tipo_proc:'info', url:mod});
		// }
		// catch(ex) {}
		//app.loadAsync({mod:mod, params_init:{id:id}, params_render:{id:id}});
		app.loadAsync({mod:url, params_init:params, params_render:params});
	},
});

define([], function () {
	return router;
});