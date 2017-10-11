module.exports = function(army) {
	'use strict';
	
	var table = 'inventarios_plantas',
		pk = 'idInventarioPlanta',
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

	army.app.get(route + '/existencias_mensual', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.db.inventarios_plantas.findAll({
			include: [
				{
					model: army.db.cierres, 
					as:'cierre', 
					where: army.sequelize.where(
						army.sequelize.fn('DATE_FORMAT', army.sequelize.col('fechaFin'), '%Y-%m'),
						params.fecha
					),
				},
				{model:army.db.consumibles, as:'consumible'}, 
				{	model:army.db.producciones,
					as:'produccion',
					include: [{
						model:army.db.obras,
						as:'obra',
					}/*,{
						model:'inventarios_materiales',
						as:'inventarios_materiales',
						includes: [{
							model:'materiales',
							as:'material'
						}] 
					}*/],
				},
			],
			order: ['fecha', 'hora'],
		})
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});
};