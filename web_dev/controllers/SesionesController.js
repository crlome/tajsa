module.exports = function(army) {
	var route = '/sesiones';
	'use strict';
	var db = army.db;

	army.app.get(route + '/getUser', function(req, res, next) {
		var data = {
			clave: 'prueba',
		};
		res.json(data);
	});

	army.app.post(route + '/login', function(req, res) {
		//console.log('login');
		//console.log(req.body);

		army.passport.authenticate('local', function(err, user, info) {
			//console.log('authenticate: ', err, user, info);
			if (err || !user)
				return res.json({user:user, errmsg:err});

			req.logIn(user, function(err) {
				req.session.passport.user;
				//console.log('res user', req.session);				

				return res.json({user:user, errmsg:err});
			});
		})(req, res);
	});

	army.app.get(route + '/logout', function(req, res, next) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

	army.app.get(route + '/planta', function(req, res) {
		res.json(req.session.passport.user.idPlanta || 0);
	});
};