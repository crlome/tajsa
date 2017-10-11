var MoModel = Backbone.Model.extend({
	defaults: {
		idConfiguracion	: 1,
		asfalto 		: 0,
		combustible		: 0,
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
	var ViMain = viewsBase.base.extend({
		el: '#configuraciones',
		events:{
			'click .btn-agregar' : 'click_btnagregar',
			'click .gv-detalles .ico-cancelar' : 'click_gvdetalles_icocancelar',
		},
		initialize: function() {
			var that = this;

			this.form = this.$el.find('.form-data');
			this.gvDetalles = this.$el.find('.gv-detalles');

			this.tmp_tr_detalles = Handlebars.compile(this.$el.find('.tmp_tr_detalles').html());

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'produccion', value:2}, {field:'idPlanta', to:'u'}],
				},
			};

			var tyas = this.form.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.save();
			}).on('submit', function (e) {
				e.preventDefault();
			});
			app.ut.masks(this.$el);

			this.idConfiguracion = 2;
		},
		/*-------------------------- Base ---------------------------*/
		render: function(){
			var that = this;
			viewsBase.abc.prototype.render.call(this);

			function done(data){
				if(data.data.length > 0){
					var trs = that.tmp_tr_detalles(data);
					that.gvDetalles.find('tbody').html(trs);
				}
			}
			var options = {
				where: {
					idConfiguracion: this.idConfiguracion,
					activo: 1,
				},
				includes: [
					{model:'consumibles', as:'consumible'},
				],
			};
			app.ut.request({url:'/configuraciones_detalles', data:options, done:done});
		},
		close: function(){
			viewsBase.abc.prototype.close.call(this);
		},
		clean: function() {
			this.form[0].reset();
			this.tyas.tyaidConsumible.data('fn').clean();
		},
		save: function(){
			var that = this;
			var json = viewsBase.base.prototype.getData.call(this, this.form);
			json.idPlanta = {to:'u'};
			json.idConfiguracion = this.idConfiguracion;

			var idConsumible = that.tyas.tyaidConsumible.data('fn').current('idConsumible');
			var row = this.gvDetalles.find('tbody tr[data-idconsumible="' + idConsumible + '"]');
			if(row.length > 0) {
				this.clean();
				app.ut.message({text:'Este consumible ya esta agregado', tipo:'warning'});
				return;
			}

			function done(data){
				if(app.ut.handleErr(data)) {
					data.data.consumible = that.tyas.tyaidConsumible.data('fn').current();

					var trs = that.tmp_tr_detalles(data);
					that.gvDetalles.find('tbody').prepend(trs);

					that.clean();
				}
			}
			app.ut.request({url:'/configuraciones_detalles', data:json, done:done, type:'POST'});
		},
		/*------------------------- Eventos -------------------------*/
		click_btnagregar: function(){
			this.form.submit();
		},
		click_gvdetalles_icocancelar: function(e) {
			var tr = $(e.currentTarget).parents('tr');
			var idConfiguracionDetalle = tr.data('idconfiguraciondetalle');

			function ok() {
				function done(data) {
					if(app.ut.handleErr(data, true)) {
						app.ut.message({text:'El registro se elimino correctamete', tipo:'success'});
						tr.remove();
					}
				}
				app.ut.request({url:'/configuraciones_detalles/' + idConfiguracionDetalle, done:done, type:'DELETE'});
			}
			app.ut.confirm({body:'¿Desea eliminar el registro?', done:ok});
		}
	});
	return {view: ViMain};
});
