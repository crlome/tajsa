var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioMaterial	: 0,
		idMaterial				: 0,
		precio					: 0,
		cantidad				: 0,
		fecha					: new Date(),
		hora					: '',
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
		el: '#entradasMateriales',
		initialize: function() {
			this.pk = 'idInventarioMaterial';
			this.url = '/inventarios_materiales';
			this.model = MoModel;

			this.fks = {
				idMaterial: {
					url: 'materiales',
					where:[{field:'activo', value:1}],
				},
			};

			this.extras = {
				locked: ['idMaterial'],
				includes: [{model:'materiales', as:'material'}],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			this.popInsert = new ViPopInsert({url:this.url, pk:this.pk, parentView:this, el:this.$el.find('.modal-insert')});

			var columns = [
				{nombre:'Material', field:'material', width:700, tmp:'{{nombre}}', join:{table:'materiales', as:'material', field:'nombre'}},
				{nombre:'M³', field:'cantidad', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'1'}];

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
				where: { activo:1 }
			};
			app.ut.request({url:'/materiales', data:json, done:done});

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
					idMaterial: tr.data('idmaterial'),
					material: {
						idMaterial: tr.data('idmaterial'),
						nombre: tr.data('nombre'),
					},
					cantidad: tr.find('input').val(),
					fecha: json.fecha,
					hora: json.hora,
				});
			}

			return {data:detalles, isArray:true, includes:['idMaterial']};
		},
		/*-------------------------- Eventos ---------------------------*/
		focus_gvdatos_input: function(e) {
			$(e.currentTarget).select();
		},
	});
	return {view: ViMain};
});