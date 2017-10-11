module.exports = function(army) {
	'use strict';
	
	var table = 'producciones',
		pk = 'idProduccion',
		route = '/' + table;

	army.app.get(route, function(req, res) {
		army.services.get({req:req, res:res, model:table});
	});

	army.app.post(route, function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		var produccion;

		var hora = army.getCurrTime();
		params.hora = hora;

		army.sequelize.transaction({autocommit: false}).then(function(t) {
			return army.db.producciones.create(params, {transaction:t})
			/*.then(function(row, err) {
				console.log('============> 0');
				if(err) throw err;

				produccion = row;
				return army.db.configuraciones_detalles.findAll({transaction:t});
			})*/.then(function(row, err) {
				console.log('============> 1');
				if(err) throw err;

				var rows = params.detalles;
				produccion = row;

				if(rows.length == 0)
					throw 'No se encontraron registros en las configuraciones';
				else {
					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i];//.toJSON();

						var inventario = {
							idProduccion: produccion.idProduccion,
							idConsumible: jrow.idConsumible,
							cantidad: produccion.cantidad * jrow.valor,
							metros: produccion.cantidad,
							valor: jrow.valor,
							tipo_asfalto: jrow.tipo_asfalto,
							fecha: produccion.fecha,
							hora: hora,
							tipo: army.tipos.salida,
						};
						inventarios.push(inventario);
					}

					return army.db.inventarios_plantas.bulkCreate(inventarios, {transaction:t});
				}
			}).then(function(row, err) {
				console.log('============> 3');
				if(err) throw err;

				return army.db.composiciones.findAll({
							where: {
								idProducto: produccion.idProducto,
							},
							transaction:t
						});
			}).then(function(rows, err) {
				console.log('============> 4');
				if(err) throw err;

				if(rows.length == 0)
					throw err || 'Tiene que agregar la composicion de este producto';
				else {
					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i].toJSON();

						var inventario = {
							idMaterial: jrow.idMaterial,
							idProduccion: produccion.idProduccion,
							cantidad: produccion.cantidad * (jrow.porcentaje / 100),
							fecha: produccion.fecha,
							hora: hora,
							tipo: army.tipos.salida,
						};
						inventarios.push(inventario);
					}

					return army.db.inventarios_materiales.bulkCreate(inventarios, {transaction:t});
				}
			}).then(function(result, err) {
				console.log('============> its done');
				if(err) throw err;

				return t.commit().then(function() {
					res.json({data:produccion, errnum:0, errmsg:err || ''});
				});
			}).catch(function(err) {
				console.log('============> its a rollback', err);
				return t.rollback().then(function() {
					res.json({data:null, errnum:0, errmsg:err.toString()});
				});
			});
		});
	});

	army.app.put(route + '/:id', function(req, res) {
		//army.services.update({req:req, res:res, model:table, pk:pk});

		var params = army._.merge({}, req.params, req.body, req.query);
		var produccion;
		var idProduccion = params.id;
		if(!idProduccion) {
			res.json({data:null, errnum:0, errmsg:'Produccion no valida'});
			return;
		}

		var hora = army.getCurrTime();
		params.hora = hora;
		console.log('params: ', params)

		army.sequelize.transaction({autocommit: false}).then(function(t) {
			return army.db.producciones
			.update(params,
				{
					where: {
						idProduccion: idProduccion
					},
					transaction:t
				}
			).then(function(row, err) {
				console.log('============> 1');
				if(err) throw err;

				var array_update = Array();
				for (var i = 0; i < params.detalles.length; i++) {
					var detalle = params.detalles[i];
					var data = {
						cantidad: params.cantidad * detalle.valor,
						metros: params.cantidad,
						valor: detalle.valor,
						tipo_asfalto: detalle.tipo_asfalto,
						fecha: params.fecha,
					};
					var where = {
						where: {
							idProduccion: idProduccion,
							idConsumible: detalle.idConsumible,
						},
						transaction: t,
					};

					array_update.push(army.db.inventarios_plantas.update(data, where));
				}

				return Promise.all(array_update);
			}).then(function(row, err) {
				console.log('============> 3');
				if(err) throw err;

				return army.db.composiciones.findAll({
							where: {
								idProducto: params.idProducto,
							},
							transaction:t
						});
			}).then(function(rows, err) {
				console.log('============> 4');
				if(err) throw err;

				var array_update = Array();
				for (var i = 0; i < rows.length; i++) {
					var jrow = rows[i];

					var data = {
						cantidad: params.cantidad * (jrow.porcentaje / 100),
						fecha: params.fecha,
					};
					var where = {
						where: {
							idProduccion: idProduccion,
							idMaterial: jrow.idMaterial,
						},
						transaction: t,
					};

					array_update.push(army.db.inventarios_materiales.update(data, where));
				}

				return Promise.all(array_update);
			}).then(function(result, err) {
				console.log('============> its done');
				if(err) throw err;

				return t.commit().then(function() {
					params.idProduccion = idProduccion;
					res.json({data:params, errnum:0, errmsg:err || ''});
				});
			}).catch(function(err) {
				console.log('============> its a rollback', err);
				return t.rollback().then(function() {
					res.json({data:null, errnum:0, errmsg:err.toString()});
				});
			});
		});
	});

	army.app.delete(route + '/:id', function(req, res) {
		var id = req.params.id;

		if(!id) {
			res.json({data: {}, errnum:-1, errmsg: 'no data'});
			return;
		}

		army.sequelize.transaction({autocommit: false}).then(function(t) {
			return army.db.producciones.findById(id, {transaction:t}).then(function(row_prod, err_prod) {
				if(err_prod) throw err_prod;

				return row_prod.destroy({transaction:t}).then(function(row, err) {
					if(err) throw err;
					
					return army.db.inventarios_plantas.destroy({ where: {idProduccion:id}, transaction:t });
				}).then(function(row, err) {
					if(err) throw err;

					return army.db.inventarios_materiales.destroy({ where: {idProduccion:id}, transaction:t });
				}).then(function(row, err) {
					if(err) throw err;

					return t.commit().then(function() {
						res.json({data:{ok:1}, errnum:0, errmsg:err || ''});
					});
				});
			}).catch(function(err) {
				console.log('its a rollback', err);
				return t.rollback().then(function() {
					res.json({data:null, errnum:0, errmsg:err.toString()});
				});
			});
		});
	});

	army.app.delete(route + '/reporte_diario', function(req, res) {
	});

	army.app.get(route + '/by_fecha_cierre', function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		console.log(params)

		army.db.producciones.findAll({
			include: [
				{
					model: army.db.cierres, 
					as:'cierre', 
					where: army.sequelize.where(
						army.sequelize.fn('DATE_FORMAT', army.sequelize.col('fechaFin'), '%Y-%m'),
						params.fecha
					),
				},
			]
		})
		.then(function(rows, err) {
			res.json({data:rows, errnum:0, errmsg:err});
		})
	});
};