var MoModel = Backbone.Model.extend({
	defaults: {
		idEmpleado	: 0,
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
		el: '#empleados',
		initialize: function() {
			this.pk = 'idEmpleado';
			this.url = '/empleados';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre','apaterno','amaterno'],
			};

			var columns = [
				{nombre:'Apellido Paterno', field:'apaterno', width:300},
				{nombre:'Apellido Materno', field:'amaterno', width:300},
				{nombre:'Nombre', field:'nombre', width:400},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			// this.popAction.mode = {
			// 	SaveAndContinue: true
			// };
		},
	});
	return {view: ViMain};
});