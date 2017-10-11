var _ = null;

module.exports = function(army) {
	_ = army._;

	'use strict';

	army.app.get('/', function(req, res, next) {
		res.render('index.ejs');
	});

	army.app.get('/main', function(req, res, next) {
		// console.log('req.session', req.session.passport);
		// console.log('req.session', req.session.passport.user.menus_usuarios);
		var user = (req.session.passport && req.session.passport.user) || {
			usuario: 'admin',
			clave: 'admin',
		};
		res.render('main.ejs', { user:user });
	});

	army.app.get('/templates/find/:modelo', function(req, res, next) {
		console.log('-------------------------- begin find template --------------------------');
		// console.log(params);
		var tpl = req.param('modelo');

		// console.log('id: ' + tpl);
		var url = __dirname + '/../assets/templates/' + tpl + '.html';

		// console.log('looking for template: ' + url);
		console.log('-------------------------- end find template --------------------------');
		var fs = require('fs')
		fs.readFile(url, function (err, contents) {
			if (err){
				// console.log(err);
				res.contentType('text/html');
				res.send(err);
			}
			else {
				res.contentType('text/html');
				res.send(contents);
			}
		});

		// res.json('ok insc');
	});

	army.app.get('/controles/grid*:model?', function(req, res) {
		console.log('/controles/grid/*:model?');

		var model = req.param('model').toLowerCase(),
			params = req.query,
			criteria = {};

		console.log(params);

		var where = {};
		if(params.aggregation.specials) {
			//console.log(params.aggregation.specials[0])
			for (var i = 0; i < params.aggregation.specials.length; i++) {
				var agsp = params.aggregation.specials[i];
				army.setParamVal(where, agsp, req.session.passport);
				// if(agsp.to == 'u'/* && req.session.user.tipo != 7*/)
				// 	where[agsp.field] = req.session.passport.user[agsp.field];
				// else if(agsp.value == 'null')
				// 	where[agsp.field] = null;
				// else
				// 	where[agsp.field] = agsp.value;
			}
		}
		console.log('=== specials ===');
		console.log(params.aggregation.specials);
		console.log('=== specials ===');

		var skip = (params.data.page-1)*params.data.pageSize,
			limit = parseInt(params.data.pageSize, 10);

		var params_find = {
			where: where,
			offset: skip,
			limit: limit,
		};

		var includes = params.includes || [];

		var filters = params.aggregation['filter'] || [];
		for (var i = 0; i < filters.length; i++) {
			var filter = filters[i];
			if(filter.query.length == 0)
				continue;

			console.log('===========> filter <===========');
			console.log(filter);
			console.log('===========> filter <===========');
			if(filter.table === undefined)
				where[filter.field] = {
					$like: '%' + filter.query + '%',
				};
			else {
				params_find.include = Array();

				var include = {
					model: army.db[filter.table],
					as: filter.field,
					required: true,
					where: {},
				}

				include.where[filter.where] = {
					$like: '%' + filter.query + '%',
				};

				params_find.include.push(include);
			}
		}
		
		if(includes.length > 0) {
			params_find.include = params_find.include || Array();

			for (var i = 0; i < includes.length; i++) {
				var extras = includes[i].extras;
				if(extras) {
					if(extras.limit)
						extras.limit = parseInt(extras.limit, 10);
				}

				var inc_model = includes[i];
				console.log('===========> includes <===========');
				console.log(includes[i]);
				console.log('===========> includes <===========');

				var find_inc = _.findWhere(params_find.include, {model:army.db[inc_model.model]});
				if(find_inc) {
					_.extend(find_inc.where, includes[i].where);

					if(extras)
						_.extend(find_inc, extras);

					continue;
				}

				var include = {
					model: army.db[inc_model.model],
					as: inc_model.as || inc_model.model,
				};

				if(extras)
					_.extend(include, extras);

				if(includes[i].where)
					include.where = includes[i].where;
				params_find.include.push(include);

				console.log('================== BEGIN INC ==================');
				console.log('extras: ', extras);
				console.log('model: ', inc_model);
				console.log('model: ', army.db[inc_model]);
				console.log('================== END INC ==================');
			}
		}

		var order = params.aggregation['order'] || {};
		if(order) {
			var tipo_order = '';
			switch(order.orden) {
				case '1':
					params_find.order = order.field + ' ASC';
					break;
				case '-1':
					params_find.order = order.field + ' DESC';
					break;
				default:
					break;
			}
		}

		console.log('================== BEGIN VARS ==================');
		console.log('model: ', model, '<--');
		console.log('where: ', where, '<--');
		console.log('order: ', order, '<--');
		console.log('params_find: ', params_find, '<--');
		//console.log('params_find.include[0].where: ', (params_find.include || params_find.include[0].where), '<--');
		console.log('army.db[model]: ', army.db[model], '<--');
		console.log('================== END VARS ==================');

		if(model == 'usuarios')
			params_find.attributes = ['idUsuario', 'nombre', 'usuario', 'activo', 'idPlanta', 'idPrimSync', 'createdAt', 'updatedAt'];

		army.db[model].findAndCountAll(params_find).then(function(result, err) {
			//console.log('count: ', result);
			console.log('ok');

			res.json({data: result.rows, total: result.count, aggregation: {}, session: {}});
		});

		// res.json({data: {}, total: 1, aggregation: {}, session: {}});
	});

	army.app.get('/controles/tya*:model?', function(req, res) {
		var criteria = req.query;

		var model = criteria.model.toLowerCase(),
			query = criteria.query,
			filters = criteria.filters || {},
			where = criteria.where || {},
			sorts = criteria.sorts || {},
			displayKey = criteria.displayKey || {};

		console.log('====')
		console.log(query);
		console.log(filters);
		console.log(where);
		console.log(sorts);
		console.log('====')

		var filtros = {
			$or: [],
		};
		for (var i = 0; i < filters.length; i++) {
			var filter = {};
			filter[filters[i].filter] = {
				$like: '%' + query + '%',
			};
			filtros['$or'].push(filter);
		}
		for (var i = 0; i < where.length; i++) {
			if(where[i].type && where[i].type == 'or') {
				var filter = {};
				//filter[where[i].field] = where[i].value;
				army.setParamVal(filter, where[i], req.session.passport);
			}
			else
				army.setParamVal(filter, where[i], req.session.passport);
				//filtros[where[i].field] = where[i].value;
		}

		if(filtros['$or'].length == 0)
			delete filtros['$or'];

		console.log(filtros);
		console.log(model);
		console.log(army.db[model].findAll);

		var params_find = {
			limit: 15,
			where: filtros,
		};
		
		if(model == 'usuarios')
			params_find.attributes = ['idUsuario', 'nombre', 'usuario', 'activo', 'idPlanta', 'idPrimSync', 'createdAt', 'updatedAt'];

		army.db[model].findAll(params_find).then(function(result) {
			console.log('res: ', result);
			
			// console.log(docs);
			res.json({data:result, errmsg:'', errnum:0});
		});
	});
};