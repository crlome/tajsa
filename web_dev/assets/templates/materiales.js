var MoModel = Backbone.Model.extend({
	defaults: {
		idMaterial 		: 0,
		nombre 			: '',
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
		el: '#materiales',
		events: {
		},
		initialize: function() {
			this.pk = 'idMaterial';
			this.url = '/materiales';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre'],
			};
			
			var columns = [
				{nombre:'Nombre del material', field:'nombre', width:1000},
			];

			var specials = [
				{field:'idPlanta', to:'u'},
			];

			viewsBase.abc.prototype.initialize.call(this, columns, null, specials);

			this.popAction.mode = {
				getPlanta: true
			};
		},
	});
	return {view: ViMain};
});