module.exports = function dal(army) {

	var getIncludes = function(params, where) {
		where.include = Array();

		for (var i = 0; i < params.includes.length; i++) {
			var inc = params.includes[i];

			if(inc.model === undefined)
				inc = JSON.parse(JSON.stringify(inc).replace(/[\[\]]/gi, ''))

			var curr = {model:army.db[inc.model], as:inc.as || inc.model};
			//console.log('curr[' + i + ']: ', inc);

			where.include.push(curr);

			if(inc.includes)
				getIncludes(inc, curr);
		}
	}

	var get = function get(json) {
		var model = json.model,
			req = json.req,
			res = json.res,
			next = json.next,
			params_find = army._.merge({}, req.params, req.body, req.query);

		for(var key in params_find.where) {
			if(params_find.where[key] == 'null')
				params_find.where[key] = null;
		}

		var where = Object();
		if(params_find.where) {
			where.where = params_find.where;
			for(var key in where.where) {
				var row = where.where[key];

				army.setParamVal(where.where, {field:key, value:row}, req.session.passport);
			}
		}

		if(model == 'usuarios')
			where.attributes = ['idUsuario', 'nombre', 'usuario', 'activo', 'idPlanta', 'idPrimSync', 'createdAt', 'updatedAt'];

		if(params_find.includes) {
			where.include = Array();
			getIncludes(params_find, where);
			// console.log('getIncludes', where.include);
			// console.log('getIncludes', where.include[1].include);
			// console.log('getIncludes', where.include[1].include[1].include);

			// for (var i = 0; i < params_find.includes.length; i++) {
			// 	var inc = params_find.includes[i];
			// 	var curr = {model:army.db[inc.model], as:inc.as || inc.model};

			// 	if(inc.includes) {
			// 		curr.include = Array();
			// 		for (var i = 0; i < inc.includes.length; i++) {
			// 			var sub_inc = inc.includes[i]
			// 			curr.include.push({model:army.db[sub_inc.model], as:sub_inc.as || sub_inc.model});
			// 		}
			// 	}

			// 	where.include.push(curr);
			// }
		}

		if(params_find.order && params_find.order.length > 0)
			where.order = params_find.order;

		console.log(where)
		army.db[model].findAll(where).then(function(result, err) {
			if(next && typeof next === 'function')
				next({data: result, errnum:0, errmsg: err || ''});
			else
				res.json({data: result, errnum:0, errmsg: err || ''});
		});
	}

	var create = function create(json) {
		var model = json.model,
			req = json.req,
			res = json.res,
			next = json.next,
			params = army._.merge({}, req.params, req.body, req.query);


		console.log('=== INSERT ===');
		console.log(params);

		if(params.isArray && params.data instanceof Array) {
			var arr_inserts = Array();
			for (var i = 0; i < params.data.length; i++) {
				var row = params.data[i];
				for (var key in row)
					army.setParamVal(row, {field:key, value:row[key]}, req.session.passport);

				arr_inserts.push(army.db[model].create(row));
			}

			Promise.all(arr_inserts).then(function(rows, err) {
				console.log(next, typeof next, typeof next === 'function')
				if(next && typeof next === 'function')
					next({data: rows, errnum:0, errmsg: err || ''});
				else
					res.json({data: rows, errnum:0, errmsg: err || ''});
			});
		}
		else {
			for (var key in params)
				army.setParamVal(params, {field:key, value:params[key]}, req.session.passport);

			army.db[model].create(params).then(function(result, err) {
				// console.log('err', err);
				if(next && typeof next === 'function')
					next({data: result, errnum:0, errmsg: err || ''});
				else
					res.json({data: result, errnum:0, errmsg: err || ''});
			});
		}
	}

	var update = function update(json) {
		var model = json.model,
			req = json.req,
			res = json.res,
			next = json.next,
			pk = json.pk,
			params = army._.merge({}, req.body, req.query);

		var id = req.params.id;

		if(!id) {
			res.json({data: {}, errnum:-1, errmsg: 'no data'});
			return;
		}

		for (var key in params)
			army.setParamVal(params, {field:key, value:params[key]}, req.session.passport);

		army.db[model].findById(id).then(function(row, err) {
			// console.log(row, err);

			if(row) {
				if(model == 'usuarios')
					delete params.contrasenia;

				row.update(params).then(function(result, err) {
					if(model == 'usuarios') {
						row = row.toJSON();
						delete row.contrasenia;
					}

					if(next && typeof next === 'function')
						next({data: row, errnum:0, errmsg: err || ''});
					else
						res.json({data: row, errnum:0, errmsg: err || ''});
				});
			}
			else {
				if(next && typeof next === 'function')
					next({data: null, errnum:0, errmsg: 'No se encontraron datos que procesar'});
				else
					res.json({data: null, errnum:0, errmsg: 'No se encontraron datos que procesar'});
			}
		});
	}

	var disable = function disable(json) {
		var model = json.model,
			req = json.req,
			res = json.res,
			next = json.next,
			pk = json.pk,
			params = army._.merge({}, req.params, req.body, req.query);

		var id = req.params.id;

		if(!id) {
			res.json({data: {}, errnum:-1, errmsg: 'no data'});
			return;
		}

		// console.log('=== params ===');
		// console.log(params);
		// console.log('=== params ===');
		if(params.delete == 1) {
			destroy(json);
			return;
		}

		army.db[model].findById(id).then(function(row, err) {
			// console.log(row, err);

			if(row)
				row.update({activo:0}).then(function(result, err) {
					if(model == 'usuarios') {
						row = row.toJSON();
						delete row.contrasenia;
					}

					if(next && typeof next === 'function')
						next({data: row, errnum:0, errmsg: err || ''});
					else
						res.json({data: row, errnum:0, errmsg: err || ''});
				});
			else {
				if(next && typeof next === 'function')
					next({data: null, errnum:0, errmsg: 'No se encontraron datos que procesar'});
				else
					res.json({data: null, errnum:0, errmsg: 'No se encontraron datos que procesar'});
			}
		});
	}

	var destroy = function destroy(json) {
		var model = json.model,
			req = json.req,
			res = json.res,
			next = json.next,
			pk = json.pk;

		var id = req.params.id;

		if(!id) {
			res.json({data: {}, errnum:-1, errmsg: 'no data'});
			return;
		}

		army.db[model].findById(id).then(function(row, err) {
			// console.log(row, err);

			if(row)
				row.destroy().then(function(result_delete, err_delete) {
					if(typeof result_delete == 'number' && result_delete == 0)
						err = 'No se encontraron datos que procesar';

					if(next && typeof next === 'function')
						next({data: row, errnum:0, errmsg: err || ''});
					else
						res.json({data: row, errnum:0, errmsg: err || ''});
				});
			else {
				if(next && typeof next === 'function')
					next({data: row, errnum:0, errmsg: 'No se encontraron datos que procesar'});
				else
					res.json({data: row, errnum:0, errmsg: 'No se encontraron datos que procesar'});
			}
		});
	}

	var services = {
		create: create,
		destroy: destroy,
		disable: disable,
		get: get,
		update: update,
	};

	return services;
};