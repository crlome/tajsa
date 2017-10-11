module.exports = function(army) {
	'use strict';
	
	var table = 'clientes',
		pk = 'idCliente',
		route = '/' + table;

	army.app.get(route, function(req, res) {
		army.services.get({req:req, res:res, model:table});
	});

	army.app.post(route, function(req, res) {
		army.services.create({req:req, res:res, model:table});
	});

	army.app.put(route + '/:id', function(req, res) {
		army.services.update({req:req, res:res, model:table, pk:pk});
	});

	army.app.delete(route + '/:id', function(req, res) {
		army.services.disable({req:req, res:res, model:table, pk:pk});
	});

	army.app.get(route + '/solo_los_activos', function(req, res) {
		army.db.clientes.findAll({}).then(function(rows, err) {
			//res.json({data:rows, errnum:0, errmsg:err});
			army.json(res, rows, err);
		});
	});
};