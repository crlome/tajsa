var MoModel = Backbone.Model.extend({
	defaults: {
		idComposicion 	: 0,
		idProducto 	 	: 0,
		idMaterial 		: 0,
		porcentaje 		: 0,
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
		el: '#composiciones',

		initialize: function() {
			this.pk = 'idComposicion';
			this.url = '/composiciones';
			this.model = MoModel;

			this.fks = {
				idProducto: {
					url: 'productos',
					filters: [{filter:'nombre'}],
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idMaterial: {
					url: 'materiales',
					filters: [{filter:'nombre'}],
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				clean: ['idProducto','idMaterial','porcentaje'],
			};
				
			var columns = [
				{nombre:'Nombre del producto', field:'dKeyidProducto', width:400},
				{nombre:'Nombre del material', field:'dKeyidMaterial', width:400},
				{nombre:'Porcentaje', field:'porcentaje', width:200},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				getPlanta: true
			};
		},
	});
	return {view: ViMain};
});