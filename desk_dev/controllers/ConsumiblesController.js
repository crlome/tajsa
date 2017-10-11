module.exports = function(army) {
	'use strict';
	
	var table = 'consumibles',
		pk = 'idConsumible',
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

	army.app.get(route + '/faltantes', function(req, res) {
		army.sequelize.query("	SELECT 	idConsumible, nombre, produccion, tipo, idPrimSync, idPlanta, activo, createdAt, updatedAt \
								FROM consumibles \
								WHERE idConsumible NOT IN (SELECT idConsumible FROM inventarios_ajustes WHERE idCierre IS NULL AND idConsumible IS NOT NULL) \
								AND produccion = 2 \
								AND activo = 1 \
								ORDER BY nombre", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err || ''});
		});
	});
};