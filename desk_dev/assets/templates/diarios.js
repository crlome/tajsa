var MoModel = Backbone.Model.extend({
	defaults: {
		idDiario: 0,
		idConsumible: 0,
		idMaterial1: 0,
		idMaterial2: 0,
		idMaterial3: 0,
		idMaterial4: 0,
		asfalto_ini: 0,
		asfalto_fin: 0,
		material1_ini: 0,
		material1_fin: 0,
		material2_ini: 0,
		material2_fin: 0,
		material3_ini: 0,
		material3_fin: 0,
		material4_ini: 0,
		material4_fin: 0,
		fecha: new Date(),
		activo: 1,
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
			this.pk = 'idDiario';
			this.url = '/diarios';
			this.model = MoModel;

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					//filters: [{filter:'nombre'}],
				},
				idMaterial1: {
					url: 'materiales',
				},
				idMaterial2: {
					url: 'materiales',
				},
				idMaterial3: {
					url: 'materiales',
				},
				idMaterial4: {
					url: 'materiales',
				},
			};

			this.extras = {
				includes: [
					{model:'consumibles', as:'consumible', extras:{activo:1}},
					{model:'materiales', as:'material1', extras:{activo:1}},
					{model:'materiales', as:'material2', extras:{activo:1}},
					{model:'materiales', as:'material3', extras:{activo:1}},
					{model:'materiales', as:'material4', extras:{activo:1}},
				],
			};

			var columns = [
				{nombre:'Asfalto', field:'consumible', width:200, tmp:'{{nombre}}', join:{table:'consumibles', as:'consumible', field:'nombre'}},
				{nombre:'Material', field:'material1', width:200, tmp:'{{nombre}}', join:{table:'materiales', as:'material1', field:'nombre'}},
				{nombre:'Material', field:'material2', width:200, tmp:'{{nombre}}', join:{table:'materiales', as:'material2', field:'nombre'}},
				{nombre:'Material', field:'material3', width:200, tmp:'{{nombre}}', join:{table:'materiales', as:'material3', field:'nombre'}},
				{nombre:'Material', field:'material4', width:200, tmp:'{{nombre}}', join:{table:'materiales', as:'material4', field:'nombre'}},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			// this.popAction.mode = {
			// 	SaveAndContinue: true
			// };
		},
	});
	return {view: ViMain};
});