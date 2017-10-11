var MoModel = Backbone.Model.extend({
	defaults: {
		idOperadorMaquina 	: 0,
		idEmpleado 	 		: 0,
		idMaquina 	 		: 0,
		activo 				: 1,
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
		el: '#operadoresMaquinas',
		events: {
		},
		initialize: function() {
			this.pk = 'idOperadorMaquina';
			this.url = '/operadores_maquinas';
			this.model = MoModel;

			this.fks = {
				idEmpleado: {
					url: 'empleados',
					tmp: '{{nombre}} {{apaterno}} {{amaterno}}',
					filters: [{filter:'nombre'}, {filter:'apaterno'}, {filter:'amaterno'}],
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idMaquina: {
					url: 'maquinas',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				clean: ['idEmpleado','idMaterial'],
				includes: [
					{model:'empleados', as:'empleado', extras:{activo:1}},
					{model:'maquinas', as:'maquina', extras:{activo:1}},
				],
			};

			var columns = [
				{nombre:'Empleado', field:'empleado', width:500, tmp:'{{nombre}} {{apaterno}} {{amaterno}}', join:{table:'empleados', as:'empleado', field:'nombre'}},
				{nombre:'Maquina', field:'maquina', width:500, tmp:'{{nombre}}', join:{table:'maquinas', as:'maquina', field:'nombre'}},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				getPlanta: true
			};
		},
	});
	return {view: ViMain};
});