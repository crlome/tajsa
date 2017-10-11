var _ = null,
	army = null;

function getFields(item, fields, pk) {
	var json = Object(),
		jdata = (item && item.toJSON && item.toJSON()) || (item || {});

	if(fields instanceof Array)
		json = _.pick(jdata, fields);
	else if(typeof fields === 'function')
		json = fields(item);

	json.idPrimSync = jdata[pk]

	return json;
}

function getProm(joptions) {
	var table = _.defaults(joptions.table, {where:{}, trans:null}),
		item = _.defaults(joptions.item, {trans:null}),
		crud = joptions.crud || army.crud.create,			
		mod_op;

	// console.log('crud: ', crud);
	// console.log('army.crud.create: ', army.crud.create);
	// console.log('army.crud.update: ', army.crud.update);
	switch(crud) {
		case army.crud.create:
			mod_op = table.model.create(table.data, {transaction:table.trans});
			break;
		case army.crud.update:
			table.where.transaction = table.trans;
			mod_op = table.model.update(table.data, table.where);
			break;
	}

	if(mod_op && item)
		mod_op.then(function(row, err) {
			if(err) throw err;
			console.log('on create: ', item.model.toJSON())

			return item.model.updateAttributes({idPrimSync:row[item.pk], transaction:item.trans}, {transaction:item.trans});
		});

	return mod_op;
}

function syncModel(jops) {
	var fecha_actualizacion = jops.fecha_actualizacion,
		table = jops.table,
		include = jops.include || Array(),
		pk = jops.pk,
		trans_loc = jops.trans_loc,
		trans_ser = jops.trans_ser,
		fields = jops.fields,
		update_where = jops.update_where || {
			updatedAt: {
				$gte: fecha_actualizacion
			},
			idPrimSync: {
				$not: null
			},
		},
		create_where = jops.create_where || {
			idPrimSync: null
		};

	var model = army.db[table],
		model_server = army.server.models[table];

	return model.findAll({
		where: update_where,
		include: include,
		transaction:trans_loc
	}).then(function(rows, err) {
		console.log('=====>> update model');
		if(err) throw err;

		var array_prom = Array();

		for (var i = 0; i < rows.length; i++) {
			var item = rows[i];
			var row_server = getFields(item, fields, pk);

			var joptions = {
				table: {
					model: model_server,
					data: row_server,
					trans: trans_ser,
					where: {
						where: Object(),
					},
				},
				crud: army.crud.update,
			};
			joptions.table.where.where[pk] = item.idPrimSync;

			array_prom.push(getProm(joptions));
		}

		return Promise.all(array_prom);
	}).then(function(row, err) {
		console.log('=====>> find create model');
		if(err) throw err;

		return model.findAll({
			where: create_where,
			include: include,
			transaction:trans_loc
		});
	}).then(function(rows, err) {
		console.log('=====>> create model');
		if(err) throw err;

		var array_prom = Array();

		for (var i = 0; i < rows.length; i++) {
			var item = rows[i];
			var row_server = getFields(item, fields, pk);

			var joptions = {
				table: {
					model: model_server,
					data: row_server,
					trans: trans_ser,
				},
				item: {
					model: item,
					pk: pk,
					trans: trans_loc,
				},
				crud: army.crud.create,
			};

			array_prom.push(getProm(joptions));
		}

		return Promise.all(array_prom);
	});
}

module.exports = function(army_ex) {
	army = army_ex;
	_ = army._;

	'use strict';
	var route = '/sync';

	army.app.get(route, function(req, res) {
		var fecha_actualizacion,
			row_conf;

		//res.json({data:null, errnum:0, errmsg:'err'.toString()});

		army.server.sequelize.transaction().then(function(t_server) {
			return army.sequelize.transaction().then(function(t) {
				return army.db.configuraciones.findOne()
				// ====================== BASE ======================
				.then(function(row, err) {
					console.log('=====>> find configuracion');
					if(err) throw err;
					//req.socket.emit('news', { hello: 'world' });

					row_conf = row;
					fecha_actualizacion = row.toJSON().fecha_actualizacion || '2001-01-01 00:00:00';
					console.log('config: ', fecha_actualizacion);

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'clientes',
						pk: 'idCliente',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'clave', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync cierres');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'cierres',
						pk: 'idCierre',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['fechaIni', 'fechaFin', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync consumibles');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'consumibles',
						pk: 'idConsumible',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'produccion', 'tipo', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync empleados');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'empleados',
						pk: 'idEmpleado',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'apaterno', 'amaterno', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync maquinas');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'maquinas',
						pk: 'idMaquina',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'clave', 'placa', 'tipo', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync materiales');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'materiales',
						pk: 'idMaterial',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync obras');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'obras',
						pk: 'idObra',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'clave', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync plantas');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'plantas',
						pk: 'idPlanta',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync productos');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'productos',
						pk: 'idProducto',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'precio', 'observaciones', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync usuarios');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'usuarios',
						pk: 'idUsuario',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'contrasenia', 'usuario', 'idPlanta', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync configuraciones');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'configuraciones',
						pk: 'idConfiguracion',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['idPlanta', 'capacidad_gas', 'capacidad_gas_amarillo', 'activo']
					});
				}).then(function(row, err) {
					console.log('=====>> sync unidades_medidas');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'unidades_medidas',
						pk: 'idUnidadMedida',
						trans_loc: t,
						trans_ser: t_server,
						fields: ['nombre', 'idPlanta', 'activo']
					});
				})
				// ====================== DEPENDENCIAS NIVEL 1 ======================
				.then(function(row, err) {
					console.log('=====>> sync producciones');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'producciones',
						pk: 'idProduccion',
						include: [
							{ model: army.db.productos, as: 'producto', attributes:['idPrimSync'] }, 
							{ model: army.db.clientes, as: 'cliente', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] },
							{ model: army.db.empleados, as: 'empleado', attributes:['idPrimSync'] },
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] },
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								fecha: item.fecha,
								hora: item.hora,
								cantidad: item.cantidad,
								folio: item.folio,
								placas: item.placas,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idProducto: (item.producto && item.producto.idPrimSync) || null,
								idCliente: (item.cliente && item.cliente.idPrimSync) || null,
								idObra: (item.obra && item.obra.idPrimSync) || null,
								idEmpleado: (item.empleado && item.empleado.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync operadores_maquinas');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'operadores_maquinas',
						pk: 'idOperadorMaquina',
						include: [
							{ model: army.db.empleados, as: 'empleado', attributes:['idPrimSync'] }, 
							{ model: army.db.maquinas, as: 'maquina', attributes:['idPrimSync'] }, 
						],
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								activo: item.activo,
								idPlanta: item.idPlanta,
								idEmpleado: (item.empleado && item.empleado.idPrimSync) || null,
								idMaquina: (item.maquina && item.maquina.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync composiciones');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'composiciones',
						pk: 'idComposicion',
						include: [
							{ model: army.db.productos, as: 'producto', attributes:['idPrimSync'] }, 
							{ model: army.db.materiales, as: 'material', attributes:['idPrimSync'] }, 
						],
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								porcentaje: item.porcentaje,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idProducto: (item.producto && item.producto.idPrimSync) || null,
								idMaterial: (item.material && item.material.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync configuraciones_detalles');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'configuraciones_detalles',
						pk: 'idConfiguracionDetalle',
						include: [
							{ model: army.db.configuraciones, as: 'configuracion', attributes:['idPrimSync'] }, 
							{ model: army.db.consumibles, as: 'consumible', attributes:['idPrimSync'] }, 
						],
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								valor: item.valor,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idConfiguracion: (item.configuracion && item.configuracion.idPrimSync) || null,
								idConsumible: (item.consumible && item.consumible.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync mantenimientos');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'mantenimientos',
						pk: 'idMantenimiento',
						include: [
							{ model: army.db.maquinas, as: 'maquina', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] }, 
							{ model: army.db.empleados, as: 'empleado', attributes:['idPrimSync'] }, 
						],
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								fecha: item.fecha,
								cambioAceite: item.cambioAceite,
								cambioFiltroAceite: item.cambioFiltroAceite,
								cambioFiltroAire: item.cambioFiltroAire,
								cambioAceiteHidraulico: item.cambioAceiteHidraulico,
								cambioFiltroHidraulico: item.cambioFiltroHidraulico,
								soploFiltroAire: item.soploFiltroAire,
								engrasadoMaquinaria: item.engrasadoMaquinaria,
								cargaDiesel: item.cargaDiesel,
								cargaAceiteHidraulico: item.cargaAceiteHidraulico,
								cargaAceiteMotor: item.cargaAceiteMotor,
								lavadoMaquinaria: item.lavadoMaquinaria,
								kilometraje: item.kilometraje,
								observaciones: item.observaciones,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idMaquina: (item.maquinas && item.maquinas.idPrimSync) || null,
								idObra: (item.obras && item.obras.idPrimSync) || null,
								idEmpleado: (item.empleados && item.empleados.idPrimSync) || null,
							};
						},
					});
				})
				// ====================== DEPENDENCIAS NIVEL 2 ======================
				.then(function(row, err) {
					console.log('=====>> sync inventarios_ajustes');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'inventarios_ajustes',
						pk: 'idInventarioAjuste',
						include: [
							{ model: army.db.consumibles, as: 'consumible', attributes:['idPrimSync'] }, 
							{ model: army.db.materiales, as: 'material', attributes:['idPrimSync'] }, 
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] }, 
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								cantidad: item.cantidad,
								fecha: item.fecha,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idConsumible: (item.consumible && item.consumible.idPrimSync) || null,
								idMaterial: (item.material && item.material.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync inventarios_consumibles');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'inventarios_consumibles',
						pk: 'idInventarioConsumible',
						include: [
							{ model: army.db.maquinas, as: 'maquina', attributes:['idPrimSync'] }, 
							{ model: army.db.consumibles, as: 'consumible', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] }, 
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] }, 
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								orden: item.orden,
								cantidad: item.cantidad,
								w15: item.w15,
								hd68: item.hd68,
								fecha: item.fecha,
								hora: item.hora,
								horometro: item.horometro,
								grasa: item.grasa,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idMaquina: (item.maquina && item.maquina.idPrimSync) || null,
								idConsumible: (item.consumible && item.consumible.idPrimSync) || null,
								idObra: (item.obra && item.obra.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync inventarios_emulsiones');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'inventarios_emulsiones',
						pk: 'idInventarioEmulsion',
						include: [
							{ model: army.db.clientes, as: 'cliente', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] }, 
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] }, 
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								cantidad: item.cantidad,
								fecha: item.fecha,
								hora: item.hora,
								observaciones: item.observaciones,
								lugar: item.lugar,
								litrosIniciales: item.litrosIniciales,
								litrosTendidos: item.litrosTendidos,
								metrosTendidos: item.metrosTendidos,
								rpm: item.rpm,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idCliente: (item.cliente && item.cliente.idPrimSync) || null,
								idObra: (item.obra && item.obra.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync inventarios_materiales');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'inventarios_materiales',
						pk: 'idInventarioMaterial',
						include: [
							{ model: army.db.maquinas, as: 'maquina', attributes:['idPrimSync'] }, 
							{ model: army.db.materiales, as: 'material', attributes:['idPrimSync'] }, 
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] }, 
							{ model: army.db.producciones, as: 'produccion', attributes:['idPrimSync'] }, 
							{ model: army.db.inventarios_ajustes, as: 'inventario_ajuste', attributes:['idPrimSync'] }, 
							{ model: army.db.clientes, as: 'cliente', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] }, 
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								kmSubsecuente: item.kmSubsecuente,
								tarifaA: item.tarifaA,
								impAcarreo: item.impAcarreo,
								precio: item.precio,
								folio: item.folio,
								cantidad: item.cantidad,
								capacidad: item.capacidad,
								impMatPetreo: item.impMatPetreo,
								km: item.km,
								tarifaB: item.tarifaB,
								fecha: item.fecha,
								hora: item.hora,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idMaquina: (item.maquina && item.maquina.idPrimSync) || null,
								idMaterial: (item.material && item.material.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
								idProduccion: (item.produccion && item.produccion.idPrimSync) || null,
								idInventarioAjuste: (item.inventario_ajuste && item.inventario_ajuste.idPrimSync) || null,
								idCliente: (item.cliente && item.cliente.idPrimSync) || null,
								idObra: (item.obra && item.obra.idPrimSync) || null,
							};
						},
					});
				}).then(function(row, err) {
					console.log('=====>> sync inventarios_plantas');
					if(err) throw err;

					return syncModel({
						fecha_actualizacion: fecha_actualizacion,
						table: 'inventarios_plantas',
						pk: 'idInventarioPlanta',
						include: [
							{ model: army.db.consumibles, as: 'consumible', attributes:['idPrimSync'] }, 
							{ model: army.db.producciones, as: 'produccion', attributes:['idPrimSync'] },
							{ model: army.db.cierres, as: 'cierre', attributes:['idPrimSync'] },
							{ model: army.db.inventarios_ajustes, as: 'inventario_ajuste', attributes:['idPrimSync'] }, 
							{ model: army.db.clientes, as: 'cliente', attributes:['idPrimSync'] }, 
							{ model: army.db.obras, as: 'obra', attributes:['idPrimSync'] }, 
						],
						create_where: {
							idPrimSync: null,
							idCierre: {
								$not: null
							},
						},
						trans_loc: t,
						trans_ser: t_server,
						fields: function(item) {
							return {
								metros: item.metros,
								cantidad: item.cantidad,
								valor: item.valor,
								fecha: item.fecha,
								hora: item.hora,
								tipo: item.tipo,
								activo: item.activo,
								idPlanta: item.idPlanta,
								idConsumible: (item.consumible && item.consumible.idPrimSync) || null,
								idProduccion: (item.produccion && item.produccion.idPrimSync) || null,
								idInventarioAjuste: (item.inventario_ajuste && item.inventario_ajuste.idPrimSync) || null,
								idCliente: (item.cliente && item.cliente.idPrimSync) || null,
								idObra: (item.obra && item.obra.idPrimSync) || null,
								idCierre: (item.cierre && item.cierre.idPrimSync) || null,
							};
						},
					});
				})
				// ====================== UPDATE BASES ======================
				.then(function(row, err) {
					console.log('=====>> update configuracion');
					if(err) throw err;

					var fecha = new Date();
					return row_conf.updateAttributes({fecha_actualizacion:fecha, transaction:t}, {transaction:t});
				})
				// ====================== FIN ======================
				.then( function(row, err) {
					console.log('its finish');//, row/*[0].toJSON()*/);
					if(err) throw err;

					return t_server.commit().then(function() {
						console.log('its commit server');
						t.commit().then(function() {
							console.log('its commit');
							res.json({data:{ok:1}, errnum:0, errmsg:null});
						});
					});
				}).catch(function(err) {
					console.log('its a rollback', err);
					return t_server.rollback().then(function() {
						console.log('its rollback server');
						t.rollback().then(function() {
							console.log('its rollback');
							res.json({data:null, errnum:0, errmsg:err.toString()});
						});
					}).catch(function(err) {
						t.rollback().then(function() {
							console.log('its rollback');
							res.json({data:null, errnum:0, errmsg:err.toString()});
						});
					});
				});
			});
		});
	});
};