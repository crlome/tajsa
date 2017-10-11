var MoModel = Backbone.Model.extend({
	defaults: {
		idConsumible 	: 0,
		nombre 	 		: '',
		clave 	 		: 0,
		activo 			: 1,
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
		el: '#consumibles',
		initialize: function() {
			this.pk = 'idConsumible';
			this.url = '/consumibles';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre','clave'],
			};

			var columns = [
				{nombre:'Nombre del consumible', field:'nombre', width:600},
				{nombre:'Producción', field:'produccion', width:200, tmp:'{{GetTipoProduccion .}}'},
				{nombre:'Tipo', field:'tipo', width:200, tmp:'{{GetTipoConsumbible .}}'},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				getPlanta: true
			};
		},
	});
	return {view: ViMain};
});