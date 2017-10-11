var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioMaterial	: 0,
		idMaterial				: 0,
		idCliente				: 0,
		idObra					: 0,
		cantidad				: 0,
		fecha					: new Date(),
		hora					: '',
		tipo					: 2,
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
		el: '#salidasMateriales',
		initialize: function() {
			this.pk = 'idInventarioMaterial';
			this.url = '/inventarios_materiales';
			this.model = MoModel;

			this.fks = {
				idMaterial: {
					url: 'materiales',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idObra: {
					url: 'obras',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idCliente: {
					url: 'clientes',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				includes: [
					{model:'materiales', as:'material'},
					{model:'obras', as:'obra'},
					{model:'clientes', as:'cliente'},
				],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			var columns = [
				{nombre:'Material', field:'material', width:200, tmp:'{{nombre}}', join:{table:'materiales', as:'material', field:'nombre'}},
				{nombre:'Cliente', field:'cliente', width:300, tmp:'{{nombre}}', join:{table:'clientes', as:'cliente', field:'nombre'}},
				{nombre:'Obra', field:'obra', width:200, tmp:'{{nombre}}', join:{table:'obras', as:'obra', field:'nombre'}},
				{nombre:'M³', field:'cantidad', width:80},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
			];

			var specials = [
				{field:'idCierre', value:'null'},
				{field:'idProduccion', value:'null'},
				{field:'tipo', value:'2'},
				{field:'idPlanta', to:'u'}
			];

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
			viewsBase.popAbc.prototype.render.call(this, data);

			if(this.crud == 1) {
				var fecha = new Date();

				this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
			}
		},
	});
	return {view: ViMain};
});