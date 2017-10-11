var MoModel = Backbone.Model.extend({
	defaults: {
		idModalidadMedida	: 0,
		nombre 	 			: '',
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
		el: '#unidadesMedidas',
		events: {
		},
		initialize: function() {
			this.pk = 'idModalidadMedida';
			this.url = '/unidadesMedidas';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre'],
			};

			var columns = [
				{nombre:'Nombre de la unidad de medida', field:'nombre', width:700},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view: ViMain};
});