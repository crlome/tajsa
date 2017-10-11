module.exports = function(army) {
	'use strict';
	
	var table = 'inventarios_materiales',
		pk = 'idInventarioMaterial',
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

		army.sequelize.query("SELECT 	a.idMaterial, COALESCE(b.nombre, 'Entradas') material, \
										SUM(CASE tipo WHEN 3 THEN cantidad ELSE 0 END) anterior, \
										SUM(CASE tipo WHEN 1 THEN cantidad ELSE 0 END) entradas, \
										SUM(CASE tipo WHEN 2 THEN cantidad ELSE 0 END) salidas, \
										SUM(CASE tipo WHEN 2 THEN cantidad * -1 ELSE cantidad END) actual \
							FROM inventarios_materiales a \
							INNER JOIN materiales b \
							ON a.idMaterial = b.idMaterial \
							WHERE idCierre = '" + params.idCierre + "' \
							GROUP BY a.idMaterial, b.nombre", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});

	army.app.get(route + '/existencias_mensual', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.sequelize.query("SELECT 	a.idMaterial, COALESCE(b.nombre, 'Entradas') material, \
										SUM(CASE tipo WHEN 3 THEN cantidad ELSE 0 END) anterior, \
										SUM(CASE tipo WHEN 1 THEN cantidad ELSE 0 END) entradas, \
										SUM(CASE tipo WHEN 2 THEN cantidad ELSE 0 END) salidas, \
										SUM(CASE tipo WHEN 2 THEN cantidad * -1 ELSE cantidad END) actual \
							FROM inventarios_materiales a \
							INNER JOIN materiales b \
							ON a.idMaterial = b.idMaterial \
							INNER JOIN cierres c\
							ON a.idCierre = c.idCierre\
							WHERE DATE_FORMAT(c.fechaFin,'%Y-%m') = '" + params.fecha + "' \
							GROUP BY a.idMaterial, b.nombre", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});

	army.app.get(route + '/existencias_detalles', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.db.inventarios_materiales.findAll({
			where: { idMaterial: params.idMaterial },
			include: [
				{
					model: army.db.cierres, 
					as:'cierre', 
					where: army.sequelize.where(
						army.sequelize.fn('DATE_FORMAT', army.sequelize.col('fechaFin'), '%Y-%m'),
						params.fecha
					),
				},
				{
					model: army.db.producciones, 
					as:'produccion',
					includes: [
						{model: army.db.clientes, as:'cliente'},
						{model: army.db.obras, as:'obra'},
						{model: army.db.productos, as:'producto'},
					],
				},
				{ model: army.db.clientes, as:'cliente' },
				{ model: army.db.obras, as:'obra' },
			],
			order: ['fecha', 'hora', 'tipo'],
		})
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});
};