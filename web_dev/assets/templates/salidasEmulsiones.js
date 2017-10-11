var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioEmulsion	: 0,
		cantidad				: 0,
		litrosIniciales			: 0,
		metrosTendidos			: 0,
		rpm						: 0,
		cantidad				: 0,
		fecha					: new Date(),
		hora					: '',
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
		el: '#salidasEmulsiones',
		initialize: function() {
			this.pk = 'idInventarioEmulsion';
			this.url = '/inventarios_emulsiones';
			this.model = MoModel;

			this.fks = {
				idObra: {
					url: 'obras',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idCliente: {
					url: 'clientes',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			this.extras = {
				clean: ['litrosIniciales','metrosTendidos','idObra'],
				includes: [{model:'clientes', as:'cliente'}, {model:'obras', as:'obra'}],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			var columns = [
				{nombre:'Cliente', field:'cliente', width:300, tmp:'{{nombre}}', join:{table:'clientes', as:'cliente', field:'nombre'}},
				{nombre:'Obra', field:'obra', width:300, tmp:'{{nombre}}', join:{table:'obras', as:'obra', field:'nombre'}},
				{nombre:'Cantidad', field:'cantidad', width:80},
				{nombre:'fecha', field:'fecha', width:120, type:'date'},
				{nombre:'hora', field:'hora', width:80},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'2'}, {field:'idPlanta', to:'u'}];

			viewsBase.abc.prototype.initialize.call(this, columns, this.popAction, specials);

			this.popAction.mode = {
				getPlanta: true
			};

			this.init = true;
		},
		render: function(data) {
			viewsBase.abc.prototype.render.call(this, data);
			this.reset_grid();
		},
	});

	var ViPopAction = viewsBase.popAbc.extend({
		render: function(data) {
			viewsBase.popAbc.prototype.render.call(this, data);

			if(this.crud == 1) {
				var fecha = new Date();

				this.$el.find('[data-field="rpm"]').val(1.5);
				this.$el.find('[data-field="hora"]').val(fecha.getCurrentTime());
				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());
			}
		},
		getData: function() {
			var json = viewsBase.popAbc.prototype.getData.call(this, this.form);
			json.cantidad = parseFloat(json.metrosTendidos || 0) * parseFloat(json.rpm || 0);

			return json;
		},
	});
	return {view: ViMain};
});