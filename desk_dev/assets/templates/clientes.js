var MoModel = Backbone.Model.extend({
	defaults: {
		idCliente 		: 0,
		nombre 	 		: '',
		clave 	 		: '',
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
		el: '#clientes',
		initialize: function() {
			this.pk = 'idCliente';
			this.url = '/clientes';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:1000},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			// this.popAction.mode = {
			// 	SaveAndContinue: true
			// };
		},
	});
	return {view: ViMain};
});