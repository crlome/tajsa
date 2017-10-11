var MoModel = Backbone.Model.extend({
	defaults: {
		idInventarioEmulsion	: 0,
		cantidad				: 0,
		fecha					: new Date(),
		hora					: '',
		tipo					: 1,
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
		el: '#entradasEmulsiones',
		initialize: function() {
			this.pk = 'idInventarioEmulsion';
			this.url = '/inventarios_emulsiones';
			this.model = MoModel;

			this.extras = {
				clean: ['cantidad'],
			};

			this.popSave = this.$el.find('.modal-save');
			this.popAction = new ViPopAction({url:this.url, pk:this.pk, parentView:this, el:this.popSave});

			var columns = [
				{nombre:'Cantidad', field:'cantidad', width:400},
				{nombre:'fecha', field:'fecha', width:300, type:'date'},
				{nombre:'hora', field:'hora', width:300},
			];

			var specials = [{field:'idCierre', value:'null'}, {field:'tipo', value:'1'}, {field:'idPlanta', to:'u'}];

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
	});
	return {view: ViMain};
});
