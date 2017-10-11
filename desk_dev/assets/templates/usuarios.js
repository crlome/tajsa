var MoModel = Backbone.Model.extend({
	defaults: {
		idUsuario 		: 0,
		nombre 			: '',
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
		el: '#usuarios',
		events: {
		},
		initialize: function() {
			this.pk = 'idUsuario';
			this.url = '/usuarios';
			this.model = MoModel;

			this.fks = {
				idAuxiliar: {
					url: 'auxiliares',
					where:[{field:'activo', value:1}],
				},
			};

			// this.extras = {
			// 	includes: [{model:'menus_usuaios', extras:{limit:1}}],
			// };

			var columns = [
				{nombre:'Nombre', field:'nombre', width:500},
				{nombre:'Usuario', field:'usuario', width:500},
				// {nombre:'idMenu', field:'menus_usuaios', width:300, tmp:'{{idMenuPagina}}', join:{table:'menus_usuaios', field:'idMenu'}},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);
		},
	});
	return {view: ViMain};
});