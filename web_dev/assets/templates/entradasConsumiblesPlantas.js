var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioPlanta	: 0,
		idConsumible		: 0,
		cantidad			: 0,
		valor				: 0,
		tipo_asfalto		: 0,
		fecha				: new Date(),
		hora				: '',
		tipo				: 1,
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
		el: '#entradasConsumiblesPlantas',
		initialize: function() {
			this.pk = 'idInventarioPlanta';
			this.url = '/inventarios_plantas';
			this.model = MoModel;

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:2}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				locked: ['idConsumible'],
				includes: [{model:'consumibles', as:'consumible'}],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			this.popInsert = new ViPopInsert({url:this.url, pk:this.pk, parentView:this, el:this.$el.find('.modal-insert')});

			var columns = [
				{nombre:'Consumible', field:'consumible', width:700, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Cantidad', field:'cantidad', width:100},
				{nombre:'fecha', field:'fecha', width:120, type:'date'},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'1'}, {field:'idPlanta', to:'u'}];

			viewsBase.abc.prototype.initialize.call(this, columns, this.popAction, specials);

			this.popAction.mode = {
				getPlanta: true
			};

			this.init = true;
		},
		render: function(data) {
			viewsBase.abc.prototype.render.call(this, data);
			this.reset_grid();
		},
	});

	var ViPopAction = viewsBase.popAbc.extend({
		render: function(data) {
			var that = this;
			viewsBase.popAbc.prototype.render.call(this, data);

			// this.$el.find('[data-field="tipo_asfalto"]').attr('disabled', 'disabled').find('option').eq(0).val(0);
			if(this.crud == 1) {
				var fecha = new Date();

				this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
			}
			// else {
			// 	if(this.model.get('consumible').tipo == 6)
			// 		this.$el.find('[data-field="tipo_asfalto"]').removeAttr('disabled').eq(0).val(this.model.get('tipo_asfalto'));
			// }
		},
	});

	var ViPopInsert = viewsBase.popAbc.extend({
		initialize: function(data) {
			viewsBase.popAbc.prototype.initialize.call(this, data);

			this.tmp_tr_datos = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_datos').html());
			this.gvDatos = this.$el.find('.gv-datos');

			this.events['focus .gv-datos input'] = 'focus_gvdatos_input';
		},
		render: function(data) {
			var that = this;
			viewsBase.popAbc.prototype.render.call(this, data);

			function done(data) {
				var trs = that.tmp_tr_datos(data);
				that.gvDatos.find('tbody').html(trs);
			}
			var json = {
				where: { produccion:2, activo:1 }
			};
			app.ut.request({url:'/consumibles', data:json, done:done});

			var fecha = new Date();
			this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
			this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
		},
		/*-------------------------- Base ---------------------------*/
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
					consumible: {
						idConsumible: tr.data('idconsumible'),
						nombre: tr.data('nombre'),
					},
					cantidad: tr.find('input').val(),
					fecha: json.fecha,
					hora: json.hora,
					// tipo_asfalto: tr.find('[data-field="tipo_asfalto"] option:selected').val(),
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
