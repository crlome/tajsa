module.exports = function(army) {
	'use strict';
	
	var table = 'cierres',
		pk = 'idCierre',
		route = '/' + table;

	var _ = army._;

	army.app.get(route, function(req, res) {
		army.services.get({req:req, res:res, model:table});
	});

	army.app.post(route, function(req, res) {
		var params = army._.merge({}, req.params, req.body, req.query);
		//console.log('params: ', new Date(params.fecha))
		var cierre = {
			fechaIni: params.fecha,
			fechaFin: params.fecha,
		};

		var hora = army.getCurrTime();

		army.sequelize.transaction({
			//autocommit: true,
			//isolationLevel: army.sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
		}).then(function(t) {
			return army.db.cierres.max('fechaFin', {transaction:t})
			.then(function(fecha, err) {
				if(err) throw err;
				console.log('===========> A: ');

				if(fecha != null)
					cierre.fechaIni = fecha;

				return army.db.cierres.create(cierre, {transaction:t});
			}).then(function(row, err) {
				if(err) throw err;
				console.log('===========> 0: ');
				cierre = row.toJSON();
				
				return army.sequelize.query("SELECT SUM(total) total \
											FROM	( \
														SELECT COUNT(*) total FROM inventarios_plantas WHERE idCierre IS NULL AND tipo != 3 \
														UNION \
														SELECT COUNT(*) total FROM inventarios_consumibles WHERE idCierre IS NULL AND tipo != 3 \
														UNION \
														SELECT COUNT(*) total FROM inventarios_emulsiones WHERE idCierre IS NULL AND tipo != 3 \
														UNION \
														SELECT COUNT(*) total FROM inventarios_materiales WHERE idCierre IS NULL AND tipo != 3 \
														UNION \
														SELECT COUNT(*) total FROM inventarios_ajustes WHERE idCierre IS NULL \
														UNION \
														SELECT COUNT(*) total FROM producciones WHERE idCierre IS NULL AND tipo != 3 \
													) a", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(row, err) {
					console.log('===========> 0.1: ', row);
					if(row[0].total == 0) throw 'No hay registros que actualizar';

					return army.db.inventarios_plantas.update(
						{idCierre:cierre.idCierre}, 
						{
							where: {
								fecha: {
									$lte: params.fecha
								},
								idCierre: null
							},
							transaction:t
						}
					);
				});
			}).then(function(row, err) {
				console.log('===========> 1: ', row);
				if(err) throw err;

				return army.db.inventarios_ajustes.update(
					{idCierre:cierre.idCierre}, 
					{
						where: {
							fecha: {
								$lte: params.fecha
							},
							idCierre: null
						},
						transaction:t
					}
				);
			}).then(function(row, err) {
				console.log('===========> 1.1: ', row);
				if(err) throw err;

				return army.db.inventarios_materiales.update(
					{idCierre:cierre.idCierre}, 
					{
						where: {
							fecha: {
								$lte: params.fecha
							},
							idCierre: null
						},
						transaction:t
					}
				);
			}).then(function(row, err) {
				console.log('===========> 2: ', row[0], row);
				if(err) throw err;

				return army.db.inventarios_emulsiones.update(
					{idCierre:cierre.idCierre}, 
					{
						where: {
							fecha: {
								$lte: params.fecha
							},
							idCierre: null
						},
						transaction:t
					}
				);
			}).then(function(row, err) {
				console.log('===========> 3: ', row);
				if(err) throw err;

				return army.db.inventarios_consumibles.update(
					{idCierre:cierre.idCierre}, 
					{
						where: {
							fecha: {
								$lte: params.fecha
							},
							idCierre: null
						},
						transaction:t
					}
				);
			}).then(function(row, err) {
				console.log('===========> 4: ', row);
				if(err) throw err;
				
				return army.db.producciones.update(
					{idCierre:cierre.idCierre}, 
					{
						where: {
							fecha: {
								$lte: params.fecha
							},
							idCierre: null
						},
						transaction:t
					}
				);
			}).then(function(row, err) {
				if(err) throw err;
				console.log('===========> 5: ');
				
				var inventarios = Array();
				for (var i = 0; i < params.gases.length; i++) {
					var jrow = params.gases[i];

					var inventario = {
						idCierre: cierre.idCierre,
						idConsumible: jrow.idConsumible,
						cantidad: jrow.cantidad,
						fecha: cierre.fechaFin,
						hora: hora,
						tipo: army.tipos.salida,
					};

					inventarios.push(inventario);
				}

				return army.db.inventarios_plantas.bulkCreate(inventarios || Array(), {transaction:t});
			}).then(function(row, err) {
				console.log('===========> 6', row);
				if(err) throw err;

				return army.db.inventarios_ajustes.findAll({where:{idCierre:cierre.idCierre}, transaction:t});
			}).then(function(rows_ia, err) {
				console.log('===========> 7');
				if(err) throw err;

				return army.sequelize.query("SELECT 	idConsumible idDato, \
												SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad, \
												1 tipo \
									FROM inventarios_plantas \
									WHERE idCierre = '" + cierre.idCierre + "'\
									GROUP BY idConsumible \
									UNION \
									SELECT 	idMaterial idDato, \
											SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad, \
											2 tipo \
									FROM inventarios_materiales \
									WHERE idCierre = '" + cierre.idCierre + "'\
									GROUP BY idMaterial", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(rows, err) {
					console.log('===========> 7.1');
					var array_inserts = Array();

					for (var i = 0; i < rows_ia.length; i++) {
						var row = rows_ia[i].toJSON();

						var jobject = {
								idInventarioAjuste: row.idInventarioAjuste,
								idPlanta: army.idPlanta,
								idCierre: cierre.idCierre,
								cantidad: 0,
								fecha: row.fecha,
								tipo: army.tipos.salida,
							};
						var find_row = { cantidad:0 };

						var model,
							where = {};

						if(row.tipo == 1) {
							where = {idDato:row.idConsumible, tipo:1};
							model = army.db.inventarios_plantas;
							jobject.idConsumible = row.idConsumible;
						}
						else {
							where = {idDato:row.idMaterial, tipo:2};
							model = army.db.inventarios_materiales;
							jobject.idMaterial = row.idMaterial;
						}

						find_row = _.findWhere(rows, where) || { cantidad:0 };
						var cant_obj = parseFloat(row.cantidad), //-40.40
							cant_ext = parseFloat(find_row.cantidad); //90

						console.log('===');
						console.log('tipo: ', row.tipo);
						console.log('id: ', row.idConsumible, row.idMaterial);
						console.log('cant_obj: ', cant_obj);
						console.log('cant_ext: ', cant_ext);

						if(cant_obj > cant_ext) {
							jobject.tipo = army.tipos.entrada;

							if(cant_ext < 0)
								jobject.cantidad = Math.abs((cant_ext * -1) + cant_obj);
							else if(cant_ext > 0)
								jobject.cantidad = Math.abs(cant_obj - cant_ext);
							else
								jobject.cantidad = Math.abs(cant_obj);
						}
						else if (cant_obj < cant_ext) {
							jobject.tipo = army.tipos.salida;

							if(cant_ext < 0)
								jobject.cantidad = Math.abs(cant_obj - cant_ext);
							else if(cant_ext > 0)
								jobject.cantidad = Math.abs((cant_ext * -1) + cant_obj);
							else
								jobject.cantidad = Math.abs(cant_obj);
						}

						console.log('jobject: ', jobject);
						console.log('===');

						array_inserts.push(model.create(jobject, {transaction:t}));
					}

					return Promise.all(array_inserts);
				});
			}).then(function(row, err) {
				console.log('===========> 8');
				if(err) throw err;

				return army.sequelize.query("SELECT 	idConsumible, \
														SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad \
											FROM inventarios_plantas \
											WHERE idCierre = '" + cierre.idCierre + "'\
											GROUP BY idConsumible", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(rows, err) {
					console.log('===========> 8.1');
					if(err) throw err;

					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i];

						var inventario = {
							idConsumible: jrow.idConsumible,
							cantidad: jrow.cantidad,
							fecha: cierre.fechaFin,
							hora: hora,
							tipo: army.tipos.cierre,
						};
						inventarios.push(inventario);
					}

					console.log('================= inventarios');

					return army.db.inventarios_plantas.bulkCreate(inventarios, {transaction:t});
				})
			}).then(function(row, err) {
				console.log('===========> 9');
				if(err) throw err;

				return army.sequelize.query("SELECT 	idMaterial, \
														SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad \
											FROM inventarios_materiales \
											WHERE idCierre = '" + cierre.idCierre + "'\
											GROUP BY idMaterial", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(rows, err) {
					console.log('===========> 9.1');
					if(err) throw err;

					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i];

						var inventario = {
							idMaterial: jrow.idMaterial,
							cantidad: jrow.cantidad,
							fecha: cierre.fechaFin,
							hora: hora,
							tipo: army.tipos.cierre,
						};
						inventarios.push(inventario);
					}
					console.log('================= inventarios');

					return army.db.inventarios_materiales.bulkCreate(inventarios, {transaction:t});
				})
			}).then(function(row, err) {
				console.log('===========> 10');
				if(err) throw err;

				return army.sequelize.query("SELECT 	idConsumible, \
														SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad \
											FROM inventarios_consumibles \
											WHERE idCierre = '" + cierre.idCierre + "' \
											GROUP BY idConsumible", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(rows, err) {
					console.log('===========> 10.1');
					if(err) throw err;

					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i];

						var inventario = {
							idConsumible: jrow.idConsumible,
							cantidad: jrow.cantidad,
							fecha: cierre.fechaFin,
							hora: hora,
							tipo: army.tipos.cierre,
						};
						inventarios.push(inventario);
					}
					console.log('================= inventarios');

					return army.db.inventarios_consumibles.bulkCreate(inventarios, {transaction:t});
				})
			}).then(function(row, err) {
				console.log('===========> 11');
				if(err) throw err;

				return army.sequelize.query("SELECT SUM(CASE tipo WHEN 2 THEN -1 ELSE 1 END * cantidad) cantidad \
											FROM inventarios_emulsiones \
											WHERE idCierre = '" + cierre.idCierre + "'", { type: army.sequelize.QueryTypes.SELECT, transaction:t })
				.then(function(rows, err) {
					console.log('===========> 11.1');
					if(err) throw err;

					var inventarios = Array();

					for (var i = 0; i < rows.length; i++) {
						var jrow = rows[i];

						var inventario = {
							cantidad: jrow.cantidad,
							fecha: cierre.fechaFin,
							hora: hora,
							tipo: army.tipos.cierre,
						};
						inventarios.push(inventario);
					}
					console.log('================= inventarios');

					return army.db.inventarios_emulsiones.bulkCreate(inventarios, {transaction:t});
				})
			}).then(function(row, err) {
				console.log('===========> X: ');
				if(err) throw err;
				
				return army.db.inventarios_plantas.findAll({where:{idCierre:cierre.idCierre}, transaction:t});
			}).then(function(rows, err) {
				if(err) throw err;
				console.log('its done');

				return t.commit().then(function() {
					res.json({data:rows, cierre:cierre, errnum:0, errmsg:err || ''});
				});
			}).catch(function(err) {
				console.log('its a rollback', err);
				return t.rollback().then(function() {
					res.json({data:null, errnum:0, errmsg:err.toString()});
				});
			});
		});
	});

	// army.app.put(route + '/:id', function(req, res) {
	// 	army.services.update({req:req, res:res, model:table, pk:pk});
	// });

	// army.app.delete(route + '/:id', function(req, res) {
	// 	army.services.disable({req:req, res:res, model:table, pk:pk});
	// });
};