module.exports = function(army) {
	'use strict';

	var table = 'usuarios',
		pk = 'idUsuario',
		route = '/' + table;

	army.app.get(route, function(req, res) {
		army.services.get({req:req, res:res, model:table});
	});

	army.app.post(route, function(req, res) {
		army.services.create({req:req, res:res, model:table});
	});

	army.app.put(route + '/:id', function(req, res) {
		army.services.update({req:req, res:res, model:table, pk:pk, next:next});

		function next(json) {
			var params = army._.merge({}, req.body, req.query);

			if(json.err || !params.contrasenia) {
				res.json(json);
				return;
			}

			army.db.usuarios.update({contrasenia:params.contrasenia}, {
				where: {idUsuario:json.data.idUsuario}
			}).then(function(row, err) {
				json.errmsg = err;
				res.json(json);
			});

		}
	});

	army.app.delete(route + '/:id', function(req, res) {
		army.services.disable({req:req, res:res, model:table, pk:pk});
	});

	army.app.post(route + '/extras', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);

		army.db.menus_usuarios.destroy({
			where: {
				idUsuario: params.idUsuario
			}
		}).then(function(row, err) {
			return army.db.menus_usuarios.bulkCreate(params.menus)
		}).then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		});
	});

	army.app.get(route + '/menus', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);

		army.sequelize.query("	SELECT 	a.idMenuPagina, b.nombre menun1, c.nombre menun2, \
												CASE WHEN d.idMenuUsuario > 0 THEN 1 ELSE 0 END tiene_menu \
								FROM menus_paginas a \
								INNER JOIN menus_n1 b \
								ON a.idMenuN1 = b.idMenuN1 \
								INNER JOIN menus_n2 c \
								ON a.idMenuN2 = c.idMenuN2 \
								LEFT JOIN menus_usuarios d \
								ON a.idMenuPagina = d.idMenuPagina \
								AND d.idUsuario = " + (params.idUsuario || 0) + 
								" WHERE a.activo = 1 \
								AND b.activo = 1 \
								AND c.activo = 1",
		{ type: army.sequelize.QueryTypes.SELECT }).then(function(data, err) {
			//console.log('authenticate: ', data, err);
			if(err)
				return res.json({data:null, errnum:0, errmsg:err || ''});

			var grupos = army._.groupBy(data, function(item) {
				var nombre = item.menun1;
				delete item.menun1;

				return nombre;
			});
			
			res.json({data:grupos, errnum:0, errmsg:err || ''});
		})
	});
};