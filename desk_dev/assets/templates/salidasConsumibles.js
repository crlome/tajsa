var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioConsumible	: 0,
		idConsumible			: 0,
		orden					: 0,
		cantidad				: 0,
		w15						: 0,
		hd68					: 0,
		fecha					: new Date(),
		hora					: '',
		horometro				: 0,
		grasa					: 0,
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
		el: '#salidasConsumibles',
		initialize: function() {
			var that = this;
			this.pk = 'idInventarioConsumible';
			this.url = '/inventarios_consumibles';
			this.model = MoModel;

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:1}],
				},
				idMaquina: {
					url: 'maquinas',
					// where:[{field:'tipo', value:function() {
					// 	return that.popAction.tyas.tyaidConsumible.data('fn').current('tipo');
					// }}],
				},
				idObra: {
					url: 'obras',
				},
			};

			this.extras = {
				clean: ['cantidad','idMaquina','horometro','grasa','w15','hd68'],
				includes: [
					{model:'consumibles', as:'consumible'},
					{model:'maquinas', as:'maquina'},
					{model:'obras', as:'obra'},
				],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			var columns = [
				{nombre:'Combustible', field:'consumible', width:200, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Maquina', field:'maquina', width:200, tmp:'{{nombre}}', join:{table:'maquinas', as:'maquina', field:'nombre'}},
				{nombre:'Obra', field:'obra', width:200, tmp:'{{nombre}}', join:{table:'obras', as:'obra', field:'nombre'}},
				{nombre:'Litros', field:'cantidad', width:100},
				{nombre:'Orden', field:'orden', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
				{nombre:'Hora', field:'hora', width:80},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'2'}];

			viewsBase.abc.prototype.initialize.call(this, columns, this.popAction, specials);

			// this.popAction.mode = {
			// 	SaveAndContinue: true,
			// };
			this.popAction.values_blanks = false;

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