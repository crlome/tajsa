var MoModel = Backbone.Model.extend({
	defaults: {
		idVendedor 	: 0,
		nombre		: '',
		apaterno	: '',
		amaterno	: '',
		activo 		: 1, 
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
		el: '#vendedores',
		events: {
		},
		initialize: function() {
			this.pk = 'idVendedor';
			this.url = '/vendedores';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre','apaterno','amaterno'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:400},
				{nombre:'Apellido Materno', field:'amaterno', width:300},
				{nombre:'Apellido Paterno', field:'apaterno', width:300},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view: ViMain};
});