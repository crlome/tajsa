module.exports = function(army) {
	'use strict';
	
	var table = 'inventarios_emulsiones',
		pk = 'idInventarioEmulsion',
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

	army.app.get(route + '/existencias', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.sequelize.query("SELECT 	SUM(CASE tipo WHEN 3 THEN cantidad ELSE 0 END) anterior, \
										SUM(CASE tipo WHEN 1 THEN cantidad ELSE 0 END) entradas, \
										SUM(CASE tipo WHEN 2 THEN cantidad ELSE 0 END) salidas, \
										SUM(CASE tipo WHEN 2 THEN cantidad * -1 ELSE cantidad END) actual \
						FROM inventarios_emulsiones \
						WHERE idCierre = '" + params.idCierre + "' \
			", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});

	army.app.get(route + '/existencias_mensual', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.sequelize.query("SELECT 	SUM(CASE a.tipo WHEN 3 THEN a.cantidad ELSE 0 END) anterior, \
										SUM(CASE a.tipo WHEN 1 THEN a.cantidad ELSE 0 END) entradas, \
										SUM(CASE a.tipo WHEN 2 THEN a.cantidad ELSE 0 END) salidas, \
										SUM(CASE a.tipo WHEN 2 THEN a.cantidad * -1 ELSE cantidad END) actual \
						FROM inventarios_emulsiones a \
						INNER JOIN cierres b \
						ON a.idCierre = b.idCierre \
						WHERE DATE_FORMAT(b.fechaFin,'%Y-%m') = '" + params.fecha + "' \
			", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});

	army.app.get(route + '/existencias_detalles', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.db.inventarios_emulsiones.findAll({
			include: [
				{
					model: army.db.cierres, 
					as:'cierre', 
					where: army.sequelize.where(
						army.sequelize.fn('DATE_FORMAT', army.sequelize.col('fechaFin'), '%Y-%m'),
						params.fecha
					),
				},
				{model: army.db.obras, as:'obra'},
			],
			order: ['fecha', 'hora', 'tipo'],
		})
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});
};