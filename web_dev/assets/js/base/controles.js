
var MoRow = Backbone.Model.extend();
var CoGridList = Backbone.Collection.extend({
	//model: MoRow,
	url: '',
	initialize:function () {
		this.paginate = {
			page: 1,
			total: 0,
			pageSize: 10
		};

		this.includes = Array();
	},
	getMax: function() {
		return Math.ceil(this.paginate.total/this.paginate.pageSize);
	},
	init: function(aggregation) {
		app.ut.show();
		var that = this;
		
		var dfd = $.Deferred();
		
		console.log('Envio: ');
		console.log({data: this.paginate, aggregation:aggregation});

		var __specials = [];
		var _specials = aggregation.specials;
		if(_specials)
			for (var i = 0; i < _specials.length; i++) {
				var w = {field:_specials[i].field, to:'v'};
				if(_specials[i].to == 'u')
					w.to = 'u';
				else if(_specials[i].value && typeof _specials[i].value === 'function')
					w.value = _specials[i].value();
				else
					w.value = _specials[i].value;
				
				__specials.push(w);
			}
		else
			__specials = null;

		var aggrs = {
			selRow: aggregation.selRow,
			selRows: aggregation.selRows,
			dselRows: aggregation.dselRows,
			tipo: aggregation.tipo,
			order: aggregation.order,
			filter: aggregation.filter,
			specials: __specials,
		};
		
		var initTime = new Date();
		
		$.getJSON(this.url, {data: this.paginate, aggregation:aggrs, includes:this.includes}, function(data) {
			if(data.errmsg && data.errmsg.length > 0) {
				app.ut.message({text:'Error en el grid, consulte al administrador del sistema'});
				app.ut.logging({info:data, tipo:'grid', url:that.url});
			}

			var endTime = new Date();
			console.log('Tiempo de espuesta: ' + (endTime - initTime));
			console.log('Recibo: ');
			console.log(data);

			if(typeof data.data == 'string')
				data.data = JSON.parse(data.data);
			
			that.paginate.total = data.total;
			_.each(data.data, function(row) {
				row[that.pk] = row[that.pk].toString();
				that.add(new MoRow(row));
			});
			
			dfd.resolve(data);
		}).fail(function(xhr) {
			app.ut.message({text:'Error en el grid, consulte al administrador del sistema'});
			app.ut.logging({xhr:xhr, tipo:'grid', url:that.url});
			console.log(xhr);
		}).always(function() {
			app.ut.hide();
		});
		
		return dfd;
	},
	prev: function(aggregation) {
		var res = {
				perform: false,
				promise: null
			};
		this.paginate.page --;
		if(this.paginate.page == 0)
			this.paginate.page = 1;
		else {
			this.reset();
			res.perform = true;
			res.promise = this.init(aggregation);
		}
		return res;
	},
	next: function(aggregation) {
		var max = this.getMax(),
			res = {
				perform: false,
				promise: null
			};
		
		this.paginate.page ++;
		if(this.paginate.page > max)
			this.paginate.page = max;
		else {
			this.reset();
			res.perform = true;
			res.promise = this.init(aggregation);
		}
		return res;
	},
	begin: function(aggregation) {
		var res = {
				perform: false,
				promise: null
			};
		if(this.paginate.page > 1) {
			this.paginate.page = 1;
			this.reset();
			res.perform = true;
			res.promise = this.init(aggregation);
		}
		return res;
	},
	end: function(aggregation) {
		var max = this.getMax(),
			res = {
				perform: false,
				promise: null
			};
		if(this.paginate.page < max) {
			this.paginate.page = max;
			this.reset();
			res.perform = true;
			res.promise = this.init(aggregation);
		}
		return res;
	},
	setIncludes: function(includes) {
		this.includes = includes || Array();
	}
});
var ViGrid = Backbone.View.extend({
	className: 'bb-grid',
	events: {
		/* eventos de paginacion */
		'click tfoot .gv-begin': 'click_onBeing',
		'click tfoot .gv-prev': 'click_onPrev',
		'click tfoot .gv-next': 'click_onNext',
		'click tfoot .gv-end': 'click_onEnd',
		'click tfoot .gv-all': 'click_onAll',
		'click tfoot .gv-none': 'click_onNone',
		'keypress tfoot .gv-pages': 'keypress_onPages',
		'keyup tfoot .gv-pages': 'keyup_onPages',
		
		/* eventos de ordenacion y busqueda */
		'click thead .gv-order': 'click_onOrder',
		'click thead .gv-filter': 'fake_event',
		'keypress thead .gv-filter': 'keypress_onFilter',
		'keyup thead .gv-filter': 'keyup_onFilter'
	},
	initialize: function(options) {
		var that = this;
		var cols = [];
		this.totalWidth = 0;
		_.each((options.columns || []), function(col) {
			var colExt = _.defaults(col, {width:100});
			that.totalWidth += colExt.width;
			cols.push(colExt);
		});
		this.totalWidth = (options.width || this.totalWidth) + 20;
		this.$el.css({width:this.totalWidth});
		
		var command = _.defaults((options.command || {}), {select:false, filter:false});
		this.config = {
			columns: cols,
			command: command,
			isComAct: command.select,
			extras: _.defaults((options.extras || {}), {select:false, primaryKey:null})
		};
		this.aggregates = {
			selRow: null,
			selRows: [],
			dselRows: [],
			tipo: 'none',
			order: [],
			filter: [],
			specials: options.specials || [],
		};
		this.fnTimeout = null;
		
		if(options.el)
			this.setElement(options.el);
		this.$el.addClass(this.className);
		
		var totalCols = this.config.columns.length + (this.config.isComAct ? 1 : 0);
		
		this.tagName = options.elem || 'table';
		var allnone = '';
		if(command.select)
			allnone = '<div class="small-8 columns"> \
							<a class="gv-none" href="#"> Ninguno</a> \
							<a class="gv-all" href="#"> Todos</a> \
						</div>';
						
		if(this.tagName == 'div') {
			this.className = 'ui-grid';
			this.$el.html('<section class="thead"></section><section class="tbody"></section><section class="tfoot"><article><div></div></article></section>');
			this.head = this.$el.children('.thead');
			this.body = this.$el.children('.tbody');
			this.tfoot = this.$el.children('.tfoot');
			this.tfoot.css({width:this.totalWidth-20});

			this.tmpHead = Handlebars.compile('<article>{{#columns}}<div style="width:{{width}}px">{{nombre}}</div>{{/columns}}</article>');
			this.tmpBody = Handlebars.compile('{{#rows}}<article>{{#.}}<div style="width:{{width}}px">{{GetValue .}}</div>{{/.}}</article>{{/rows}}');
		}
		else {
			this.$el.html('<thead></thead><tbody></tbody><tfoot><tr><td colspan="' + totalCols + '" class="gv-pager row"> \
							<div class="small-4 columns"> \
								<a class="gv-begin" href="#"></a>\
								<a class="gv-prev" href="#"></a>\
								<input type="text" class="gv-pages" value="1" /> <strong><span>/</span> <span class="gv-max">1</span></strong> \
								<a class="gv-next" href="#"></a>\
								<a class="gv-end" href="#"></a>\
							</div> ' + allnone +
							'\
							\
							\
							</td></tr></tfoot>');
			this.head = this.$el.children('thead');
			this.body = this.$el.children('tbody');
			this.tfoot = this.$el.children('tfoot');

			this.tmpHead = Handlebars.compile('<tr>{{#if isComAct}}<th class="gv-col-command"></i></th>{{/if}}{{#columns}}<th style="width:{{width}}px" data-field="{{field}}" {{#join}}data-join="{{table}}::{{field}}"{{/join}} class="gv-order"><strong><span>{{nombre}} </span><input type="text" class="gv-filter is-hidden" placeHolder=" Buscar"/></strong></th>{{/columns}}</tr>');
			this.tmpBody = Handlebars.compile('{{#rows}}<tr data-pkey="{{key}}" data-cid="{{cid}}"> \
													{{#if command.select}}<td class="col-command"><input type="checkbox"/></td>{{/if}} \
													{{#data}}<td>{{GetValue .}}</td>{{/data}} \
												</tr>{{/rows}}');
		}
		
		Handlebars.registerHelper('GetValue', function(item) {
			if(item.type == 'date') {
				if(!item.value)
					return '';

				if(item.value.search(/[a-zA-Z]+/) == -1)
					return item.value;

				// var fecha = new Date(item.value.toString());

				// var dia = fecha.getDate().toString(),
				// 	mes = (parseInt(fecha.getMonth().toString()) + 1).toString(),
				// 	anio = fecha.getFullYear().toString();

				// item.value = (dia.length == 1 ? '0' + dia : dia) + '-' + (mes.length == 1 ? '0' + mes : mes) + '-' + anio;

				item.value = item.value.toShortDate();
			}
			else if (item.helper) {
				item.value = Handlebars.helpers[item.helper](item.value);
			}
			else if(item.value instanceof Array) {
				var val_temp = item.value.length > 0 ? item.value[0] : '';
				try {
					item.value = Handlebars.compile(item.tmp)(val_temp);
				}
				catch(ex) {
					item.value = val_temp;
				}
			}
			else if (item.tmp) {
				try {
					item.value = Handlebars.compile(item.tmp)(item.value);
				}
				catch(ex) {
					item.value = '';
				}
			}
			else if(typeof item.value === "string") {
				item.value = item.value.replace(/&amp;/g, "&");
				item.value = item.value.replace(/&gt;/g, ">");
				item.value = item.value.replace(/&lt;/g, "<");
				item.value = item.value.replace(/&quot;/g, "\"");
				item.value = item.value.replace(/&apos;/g, "'");
				item.value = item.value.replace(/#35;/g, "#");
			}
			return item.value;
		});
		
		if(!this.config.extras.primaryKey) {
		   this.config.isComAct = false;
		   this.config.command.select = false;
		}
		
		if(this.config.command.select)
			this.events['click tbody tr .col-command input[type="checkbox"]'] = 'click_onSelect';
		
		if(this.config.extras.select)
			this.events['click tbody tr'] = 'click_onTr';
		
		this.collection = new CoGridList();
		this.collection.setIncludes(this.config.extras.includes);
		this.collection.model = options.model;
		this.collection.url = options.url || '/';
		this.collection.pk = this.config.extras.primaryKey || null;
		var prom = this.collection.init(this.aggregates);
		
		prom.then(function(data) {
			that.render(data);
		});
		
		this.head.html(this.tmpHead(this.config));
	},
	getDataRow: function(model) {
		var cols = _.extend([], this.config.columns);
		var row = {
			key: model.get(this.config.extras.primaryKey),
			cid: model.cid,
			data: [],
			command: this.config.command
		};
		for(var j=0; j<cols.length; j++) {
			var valor = null;
			if(cols[j].field.indexOf('.') == -1)
				valor = model.get(cols[j].field);
			else {
				var subcontent = cols[j].field.split('.');
				valor = model.get(subcontent[0])[subcontent[1]];
			}
								  
			row.data.push({
				value: valor,
				type: this.config.columns[j].type || 'none',
				helper: this.config.columns[j].helper || '',
				tmp: this.config.columns[j].tmp || '',
				//width: this.config.columns[j].width,
			});
		}
		
		return [row];
	},
	/*-------------------------- Base --------------------------*/
	getJoin: function(join) {
		var json = {};
		if(join) {
			join = join.split('::');
			
			json.table = join[0];
			json.where = join[1];
		}

		return json;
	},
	render: function(data){
		var rows = [];
		var cols = _.extend([], this.config.columns);
		
		for(var i=0; i<this.collection.length; i++) {
			var r = this.collection.at(i);
			var row = {
				key: r.get(this.config.extras.primaryKey),
				cid: r.cid,
				data: [],
				command: this.config.command
			};
			for(var j=0; j<cols.length; j++) {
				var valor = null;
				if(cols[j].field.indexOf('.') == -1)
					valor = r.get(cols[j].field);
				else {
					var subcontent = cols[j].field.split('.');
					valor = r.get(subcontent[0])[subcontent[1]];
				}
				
				row.data.push({
					value: valor,
					type: this.config.columns[j].type || 'none',
					helper: this.config.columns[j].helper || '',
					tmp: this.config.columns[j].tmp || '',
					//width: this.config.columns[j].width,
				});
			}
			rows.push(row);
		}
		
		var body = this.body.html(this.tmpBody({rows:rows}));
		this.tfoot.find('.gv-max').text(this.collection.getMax());
		this.tfoot.find('.gv-pages').val(this.collection.paginate.page);
		
		this.aggregates.selRows = [];
		this.aggregates.dselRows = [];
		if(data.aggregation) {
			this.aggregates.selRow = data.aggregation.selRow;
			
			if(this.aggregates.tipo == 'all') {
				_.each(body.find('tr input[type="checkbox"]'), function(tr) {
					tr.click();
				});
				
				_.each(_.uniq(data.aggregation.dselRows), function(row) { 
					body.find('tr[data-pkey="'+row+'"] input[type="checkbox"]').click();
				});
			}
			else {
				_.each(_.uniq(data.aggregation.selRows), function(row) { 
					body.find('tr[data-pkey="'+row+'"] input[type="checkbox"]').click();
				});
			}
		}
		
		return this;
	},
	reset: function() {
		var that = this;
		this.collection.reset();
		var prom = this.collection.init(this.aggregates);
		
		prom.then(function(data) {
			that.render(data);
		});
	},
	/*-------------------------- Eventos --------------------------*/
	click_onSelect: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var row = $(e.currentTarget).parents('tr');
		row.toggleClass('isMultiSelected');
		
		var cid = row.data('cid'),
			bRow = this.collection.get(cid),
			key = bRow.get(this.config.extras.primaryKey).toString();
		if(e.currentTarget.checked) {
			var index = this.aggregates.dselRows.indexOf(key);
			if (index > -1)
				this.aggregates.dselRows.splice(index, 1);
			this.aggregates.selRows.push(key);
		}
		else {
			var index = this.aggregates.selRows.indexOf(key);
			if (index > -1) {
				this.aggregates.selRows.splice(index, 1);
				this.aggregates.dselRows.push(key);
			}
		}
	},
	click_onTr: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.body.children('.isSelected').removeClass('isSelected');
				
		var currSelect = $(e.currentTarget);
		currSelect.addClass('isSelected');
		var bRow = this.collection.get(currSelect.data('cid'));
		this.aggregates.selRow = bRow.toJSON();
	},
	click_onBeing: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var that = this,
			res = this.collection.begin(this.aggregates);
		if(res.perform)
			res.promise.then(function(data) {
				that.render(data);
			});
	},
	click_onPrev: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var that = this,
			res = this.collection.prev(this.aggregates);
		if(res.perform)
			res.promise.then(function(data) {
				that.render(data);
			});
	},
	click_onNext: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var that = this,
			res = this.collection.next(this.aggregates);
		if(res.perform)
			res.promise.then(function(data) {
				that.render(data);
			});
	},
	click_onEnd: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var that = this,
			res = this.collection.end(this.aggregates);
		if(res.perform)
			res.promise.then(function(data) {
				that.render(data);
			});
	},
	click_onAll: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.aggregates.tipo = 'all';
		_.each(this.body.find('tr input[type="checkbox"]'), function(tr) {
			if(!tr.checked)
				$(tr).click();
		});
		//this.aggregates.selRows = [];
		this.aggregates.dselRows = [];
	},
	click_onNone: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.aggregates.tipo = 'none';
		_.each(this.body.find('tr input[type="checkbox"]'), function(tr) {
			if(tr.checked)
				$(tr).click();
		});
		this.aggregates.selRows = [];
		//this.aggregates.dselRows = [];
	},
	keypress_onPages: function(e) {
		var that = this;
		var key = e.which || e.keyCode || e.charCode;
		
		var time = 1000;
		if(key == 13)
			time = 0;
		
		if( key == 13 ||
			key >= 48 && key <= 57) {
			clearTimeout(this.fnTimeout);
			this.fnTimeout = setTimeout(function () {
				console.log('launch');
				var pagina = $(e.currentTarget).val().toInt(1),
					max = that.collection.getMax(),
					currPage = that.collection.paginate.page;
				if(pagina > max)
					pagina = max;
				else if(pagina <= 0)
					pagina = 1;
				else if(pagina == currPage) {
					$(e.currentTarget).val(pagina);
					return;
				}

				that.collection.reset();
				that.collection.paginate.page = pagina;
				var res = that.collection.init(that.aggregates);
				res.then(function(data) {
					that.render(data);
				});
			}, time);
		}
		else
			e.preventDefault();
	},
	keyup_onPages: function(e) {
		var that = this;
		var key = e.which || e.keyCode || e.charCode;
		console.log(key);
		
		if(key == 8 || key == 48) {
			e.which = 48;
			this.keypress_onPages(e);
		}
	},
	click_onOrder: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var elem = $(e.currentTarget),
			field = elem.data('field'),
			orden = {field:field},
			joinEl = elem.data('join');
		
		elem.parents('tr').find('th').removeClass('gv-desc gv-asc');
		
		if(this.aggregates.order.field == field) {
			orden = this.aggregates.order;
			switch(orden.orden) {
				case 1:
					orden.orden = -1;
					elem.addClass('gv-asc');
					break;
				case -1:
					orden.orden = 0;
					break;
				default:
					orden.orden = 1;
					elem.addClass('gv-desc');
					break;
			}
		}
		else {
			orden.orden = 1;
			this.aggregates.order = orden;
			elem.addClass('gv-desc');
		}

		var join = this.getJoin(joinEl);

		if(join) {
			orden.table = join.table;
			orden.where = join.where;
		}
		
		this.collection.reset();
		this.collection.paginate.page = 1;
		var that = this,
			res = this.collection.init(this.aggregates);
		res.then(function(data) {
			that.render(data);
		});
	},
	keypress_onFilter: function(e) {
		var that = this;
		var key = e.which || e.keyCode || e.charCode;
		console.log(key); 
		
		var time = 1000;
		if(key == 13)
			time = 0;
		
		if( key == 13 ||
			(key >= 32 && key <= 122) || key == 209 || key == 241
			|| key == 193 || key == 201 || key == 205 || key == 211 || key == 218
			|| key == 225 || key == 233 || key == 237 || key == 243 || key == 250) {
			clearTimeout(this.fnTimeout);
			this.fnTimeout = setTimeout(function () {
				console.log('laun filtro');

				var elem = $(e.currentTarget);
				var field = elem.parents('th').data('field');
				var joinEl = elem.parents('th').data('join');

				var filtro = {field:field};        
				var res = _.findWhere(that.aggregates.filter, filtro);
				if(res === undefined) {
					var join = that.getJoin(joinEl);

					if(join) {
						filtro.table = join.table;
						filtro.where = join.where;
					}
					filtro.query = elem.val();
					that.aggregates.filter.push(filtro);
				}
				else {
					res.query = elem.val();
				}

				that.collection.reset();
				that.collection.paginate.page = 1;
				var res = that.collection.init(that.aggregates);
				res.then(function(data) {
					that.render(data);
				});
			}, time);
		}
		else
			e.preventDefault();
	},
	keyup_onFilter: function(e) {
		var that = this;
		var key = e.which || e.keyCode || e.charCode;
		console.log(key);
		
		if(key == 8 || key == 48) {
			e.which = 48;
			this.keypress_onFilter(e);
		}
	},
	fake_event: function(e) {
		e.stopPropagation();
	},
	addTR: function(model) {
		this.collection.add(model);
		var row = this.getDataRow(model);
		
		var rowHTML = this.tmpBody({rows:row});     
		this.body.prepend(rowHTML);
	},
	modifyTR: function(data) {
		var that = this;
		var primaryKey = this.config.extras.primaryKey;
		var busqueda = {};
		busqueda[primaryKey] = data[primaryKey].toString();

		var model = this.collection.find(function(item){ 
			try {
				return item.get(primaryKey).toString() == data[primaryKey].toString(); 
			}
			catch(ex) {
				return false;
			}
		});
		model.set(data);
		var row = this.getDataRow(model);
		
		var rowHTML = this.tmpBody({rows:row});
		var tr = this.body.find('[data-cid="' + model.cid + '"]');
		tr.html($(rowHTML).html());
	}
});
/*
	CLIENTE:
	var columns = [
		{nombre:'nombre', field:'nombre', width:500},
	];
	var command = {select: false},
		extras = {
			select: true,
			primaryKey: '_id'
		};
			
	this.gvGrid = new app.controles.grid({columns:columns, command:command, extras:extras, url:'/alumnos/grid', el:$('#gvDatos')});

	SERVIDOR:
	grid: function(req, res) {
		//sails.session.set('mi param', 1);
		console.log(req.param('data'));
		console.log(req.params.all());
		Alumnos.find({}, function(err, docs) {
			console.log(sails.controllers.controles.getData(req, res, docs));
		});
	},
*/

define([], function () {
	return {controles:{grid: ViGrid}, models:{moRow: MoRow}, coGrid:{coGrid: CoGridList}};
});