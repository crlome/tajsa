var MoModel = Backbone.Model.extend({
	defaults: {
		idMaquina 		: 0,
		idUnidadMedida 	: 0,
		nombre 	 		: '',
		clave 	 		: '',
		placa 			: '',
		tipo 			: 1,
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
		el: '#maquinas',
		initialize: function() {
			this.pk = 'idMaquina';
			this.url = '/maquinas';
			this.model = MoModel;

			this.fks = {
				idUnidadMedida: {
					url: 'unidadesMedidas',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: [/*'idUnidadMedida',*/'nombre','clave','placa','tipo'],
			};

			var columns = [
				// {nombre:'Unidad de Medida', field:'dKeyidUnidadMedida', width:300},
				{nombre:'Nombre', field:'nombre', width:400},
				{nombre:'Clave', field:'clave', width:300},
				{nombre:'Placa', field:'placa', width:200},
				{nombre:'Tipo', field:'tipo', width:100, tmp:'{{GetTipoMaquina .}}'},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			// this.popAction.mode = {
			// 	SaveAndContinue: true
			// };
		},
	});
	return {view: ViMain};
});