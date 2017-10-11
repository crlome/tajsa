var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioAjuste		: 0,
		idConsumible			: 0,
		idMaterial				: 0,
		cantidad				: 0,
		fecha					: new Date(),
		tipo					: 1,
		activo					: 1,
	}
});

define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMain = viewsBase.abc.extend({
		el: '#inventariosAjustes',
		initialize: function() {
			this.pk = 'idInventarioAjuste';
			this.url = '/inventarios_ajustes';
			this.model = MoModel;

			this.fks = {
				idMaterial: {
					url: 'materiales',
					where:[{field:'activo', value:1}],
				},
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:2}],
				},
			};

			this.extras = {
				locked: ['idMaterial', 'idConsumible'],
				includes: [{model:'materiales', as:'material'}, {model:'consumibles', as:'consumible'}],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			this.popInsert = new ViPopInsert({url:this.url, pk:this.pk, parentView:this, el:this.$el.find('.modal-insert')});

			var columns = [
				{nombre:'Material', field:'material', width:350, tmp:'{{nombre}}', join:{table:'materiales', as:'material', field:'nombre'}},
				{nombre:'Consumible', field:'consumible', width:350, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Cantidad', field:'cantidad', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
			];

			var specials = [{field:'idCierre', value:'null'}];

			viewsBase.abc.prototype.initialize.call(this, columns, this.popAction, specials);

			this.init = true;
		},
		render: function(data) {
			viewsBase.abc.prototype.render.call(this, data);
			this.reset_grid();
		},
		click_nuevo: function() {
			this.popInsert.render({crud:1});
		},
	});

	var ViPopAction = viewsBase.popAbc.extend({
		render: function(data) {
			viewsBase.popAbc.prototype.render.call(this, data);

			if(this.crud == 1) {
				var fecha = new Date();

				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
			}
			else {
				if(data.model.get('tipo') == 1) {
					this.$el.find('.is-material').addClass('is-hidden');
					this.$el.find('.is-consumible').removeClass('is-hidden');
				}
				else {
					this.$el.find('.is-consumible').addClass('is-hidden');
					this.$el.find('.is-material').removeClass('is-hidden');
				}
			}
		},
	});

	var ViPopInsert = viewsBase.popAbc.extend({
		initialize: function(data) {
			viewsBase.popAbc.prototype.initialize.call(this, data);

			this.tmp_tr_materiales = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_materiales').html());
			this.tmp_tr_consumibles = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_consumibles').html());
			this.gvMateriales = this.$el.find('.gv-materiales');
			this.gvConsumibles = this.$el.find('.gv-consumibles');

			this.events['focus .gv-datos input'] = 'focus_gvdatos_input';
		},		
		/*-------------------------- Base ---------------------------*/
		render: function(data) {
			var that = this;
			viewsBase.popAbc.prototype.render.call(this, data);

			function done_cons(data) {
				var trs = that.tmp_tr_consumibles(data);
				that.gvConsumibles.find('tbody').html(trs);
			}

			function done(data) {
				var trs = that.tmp_tr_materiales(data);
				that.gvMateriales.find('tbody').html(trs);

				var json_cons = {
					where: { produccion:2, activo:1 }
				};
				app.ut.request({url:'/consumibles/faltantes', data:json_cons, done:done_cons});
			}			
			var json = {
				where: { activo:1 }
			};
			app.ut.request({url:'/materiales/faltantes', data:json, done:done});

			var fecha = new Date();
			this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
		},
		getData: function(data) {
			var json = viewsBase.popAbc.prototype.getData.call(this, this.form);
			var detalles = Array();

			var trs = this.gvMateriales.find('tbody tr');
			for (var i = 0; i < trs.length; i++) {
				var tr = trs.eq(i);

				if(tr.find('input').val() == 0)
					continue;

				detalles.push({
					idMaterial: tr.data('idmaterial'),
					material: {
						idMaterial: tr.data('idmaterial'),
						nombre: tr.data('nombre'),
					},
					cantidad: tr.find('input').val(),
					fecha: json.fecha,
					tipo: 2,
				});
			}

			var trs = this.gvConsumibles.find('tbody tr');
			for (var i = 0; i < trs.length; i++) {
				var tr = trs.eq(i);

				if(tr.find('input').val() == 0)
					continue;

				detalles.push({
					idConsumible: tr.data('idconsumible'),
					consumible: {
						idConsumible: tr.data('idconsumible'),
						nombre: tr.data('nombre'),
					},
					cantidad: tr.find('input').val(),
					fecha: json.fecha,
					tipo: 1,
				});
			}

			return {data:detalles, isArray:true, includes:['idMaterial', 'idConsumible']};
		},
		/*-------------------------- Eventos ---------------------------*/
		focus_gvdatos_input: function(e) {
			$(e.currentTarget).select();
		},
	});
	return {view: ViMain};
});