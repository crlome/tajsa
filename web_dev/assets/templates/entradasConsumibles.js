var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioConsumible	: 0,
		idConsumible			: 0,
		orden					: 0,
		folio					: 0,
		cantidad				: 0,
		w15						: 0,
		hd68					: 0,
		fecha					: new Date(),
		hora					: '',
		horometro				: 0,
		grasa					: 0,
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
		el: '#entradasConsumibles',
		initialize: function() {
			this.pk = 'idInventarioConsumible';
			this.url = '/inventarios_consumibles';
			this.model = MoModel;

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				clean: ['orden','cantidad','horometro','grasa'],
				includes: [{model:'consumibles', as:'consumible'}],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			var columns = [
				{nombre:'Combustible', field:'consumible', width:500, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Litros', field:'cantidad', width:100},
				{nombre:'Orden', field:'orden', width:100},
				{nombre:'Folio', field:'folio', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
				{nombre:'Hora', field:'hora', width:80},
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
