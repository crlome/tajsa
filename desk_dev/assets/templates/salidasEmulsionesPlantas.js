var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioPlanta	: 0,
		idConsumible		: 0,
		idCliente			: 0,
		idObra				: 0,
		cantidad			: 0,
		valor				: 0,
		fecha				: new Date(),
		hora				: '',
		tipo				: 2,
		activo				: 1,
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
		el: '#salidasEmulsionesPlantas',
		initialize: function() {
			this.pk = 'idInventarioPlanta';
			this.url = '/inventarios_plantas';
			this.model = MoModel;

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:2}, {field:'tipo', value:3}],
				},
				idObra: {
					url: 'obras',
					where:[{field:'activo', value:1}],
				},
				idCliente: {
					url: 'clientes',
					where:[{field:'activo', value:1}],
				},
			};

			this.extras = {
				locked: ['idConsumible'],
				includes: [
					{model:'consumibles', as:'consumible'},
					{model:'clientes', as:'cliente'},
					{model:'obras', as:'obra'},
				],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			this.popInsert = new ViPopInsert({url:this.url, pk:this.pk, parentView:this, el:this.$el.find('.modal-insert')});

			var columns = [
				{nombre:'Cliente', field:'cliente', width:200, tmp:'{{nombre}}', join:{table:'clientes', as:'cliente', field:'nombre'}},
				{nombre:'Obra', field:'obra', width:300, tmp:'{{nombre}}', join:{table:'obras', as:'obra', field:'nombre'}},
				{nombre:'Consumibles', field:'consumible', width:200, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Cantidad', field:'cantidad', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'2'}];

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

				this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
			}
		},
	});

	var ViPopInsert = viewsBase.popAbc.extend({
		initialize: function(data) {
			viewsBase.popAbc.prototype.initialize.call(this, data);

			this.tmp_tr_datos = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_datos').html());
			this.gvDatos = this.$el.find('.gv-datos');

			this.events['focus .gv-datos input'] = 'focus_gvdatos_input';
		},		
		/*-------------------------- Base ---------------------------*/
		render: function(data) {
			var that = this;
			viewsBase.popAbc.prototype.render.call(this, data);

			function done(data) {
				var trs = that.tmp_tr_datos(data);
				that.gvDatos.find('tbody').html(trs);
			}			
			var json = {
				where: { produccion:2, activo:1 },
				order: ['nombre']
			};
			app.ut.request({url:'/consumibles', data:json, done:done});

			var fecha = new Date();
			this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
			this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
		},
		getData: function(data) {
			var json = viewsBase.popAbc.prototype.getData.call(this, this.form);
			var trs = this.gvDatos.find('tbody tr');
			var detalles = Array();

			for (var i = 0; i < trs.length; i++) {
				var tr = trs.eq(i);

				if(tr.find('input').val() == 0)
					continue;

				detalles.push({
					idConsumible: tr.data('idconsumible'),
					idCliente: this.tyas.tyaidCliente.data('fn').current('idCliente'),
					idObra: this.tyas.tyaidObra.data('fn').current('idObra'),
					consumible: {
						idConsumible: tr.data('idconsumible'),
						nombre: tr.data('nombre'),
					},
					cliente: this.tyas.tyaidCliente.data('fn').current(),
					obra: this.tyas.tyaidObra.data('fn').current(),
					cantidad: tr.find('input').val(),
					fecha: json.fecha,
					hora: json.hora,
					tipo: 2,
				});
			}

			return {data:detalles, isArray:true, includes:['idConsumible']};
		},
		/*-------------------------- Eventos ---------------------------*/
		focus_gvdatos_input: function(e) {
			$(e.currentTarget).select();
		},
	});
	return {view: ViMain};
});