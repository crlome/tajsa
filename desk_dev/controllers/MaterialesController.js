module.exports = function(army) {
	'use strict';
	
	var table = 'materiales',
		pk = 'idMaterial',
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
		army.sequelize.query("	SELECT 	idMaterial, nombre, idPrimSync, idPlanta, activo, createdAt, updatedAt \
								FROM materiales \
								WHERE idMaterial NOT IN (SELECT idMaterial FROM inventarios_ajustes WHERE idCierre IS NULL AND idMaterial IS NOT NULL) \
								AND activo = 1", { type: army.sequelize.QueryTypes.SELECT })
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err || ''});
		});
	});
};