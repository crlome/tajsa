var MoModel = Backbone.Model.extend({
	defaults: {
		idProspecto		: 0,
		nombre			: '',
		apaterno		: '',
		amaterno		: '',
		empresa			: '',
		telefono		: '',
		celular			: '',
		email			: '',
		observaciones	: '',
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
		el: '#prospectos',
		events: {
		},
		initialize: function() {
			this.pk = 'idProspecto';
			this.url = '/prospectos';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre','apaterno','amaterno','celular','telefono','email','empresa','observaciones'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:200},
				{nombre:'Apellido Materno', field:'amaterno', width:150},
				{nombre:'Apellido Paterno', field:'apaterno', width:150},
				{nombre:'Empresa', field:'empresa', width:200},
				{nombre:'Celular', field:'celular', width:100},
				{nombre:'Telefono', field:'telefono', width:100},
				{nombre:'Email', field:'email', width:100},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true,
				getPlanta: true,
			};
		},
	});
	return {view: ViMain};
});