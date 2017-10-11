var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioEmulsion	: 0,
		idCliente				: 0,
		cantidad				: 0,
		fecha					: new Date(),
		hora					: '',
		observaciones			: '',
		lugar					: '',
		litrosIniciales			: 0,
		litrosTendidos			: 0,
		metrosTendidos			: 0,
		rpm						: 0,
		tipo					: 2,
		activo					: 1,
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
		el: '#impregnaciones',
		initialize: function() {
			this.pk = 'idInventarioEmulsion';
			this.url = '/inventarios_emulsiones';
			this.model = MoModel;

			this.fks = {
				idCliente: {
					url: 'clientes',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				clean: ['precio','cantidad','idMaterial'],
				includes: [{model:'clientes', as:'cliente'}],
			};

			var columns = [
				{nombre:'Cliente', field:'cliente', width:300, tmp:'{{nombre}}', join:{table:'clientes', as:'cliente', field:'nombre'}},
				{nombre:'Litros Iniciales', field:'litrosIniciales', width:100},
				{nombre:'Metros Tendidos', field:'metrosTendidos', width:100},
				{nombre:'Metros Tendidos', field:'metrosTendidos', width:100},
				{nombre:'RPM', field:'rpm', width:100},
				{nombre:'Cantidad', field:'cantidad', width:100},
				{nombre:'Fecha', field:'fecha', width:120, type:'date'},
				{nombre:'Hora', field:'hora', width:80},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'2'}];

			viewsBase.abc.prototype.initialize.call(this, columns, null, specials);

			this.popAction.mode = {
				getPlanta: true
			};
		},
	});
	return {view: ViMain};
});