define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMain = viewsBase.base.extend({
		el: '#rpt_inventarios',
		events:{
			'click .btn-buscar': 'click_btnbuscar',
		},
		initialize: function() {
			var that = this;
			this.form = this.$el.find('.form-data');

			this.pnlResultado = this.$el.find('.pnl-resultado');
			this.tmp_table_datos = Handlebars.compile(this.$el.find('.tmp_table_datos').html());

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.buscar();
			}).on('submit', function (e) {
				e.preventDefault();
			});

			app.ut.masks(this.$el);
		},
		/*-------------------------- Base ---------------------------*/
		render: function() {
			var that = this;
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		buscar: function() {
			var that = this;
			var json = this.getData(this.form);

			var options = {
				where: {
					fecha: {
						'$between': [json.feini, json.fefin]
					}
				},
				includes: [
					{model:'consumibles', as:'consumible'},
					{model:'obras', as:'obra'},
					{	model:'producciones',
						as:'produccion',
						includes: [{
							model:'obras',
							as:'obra',
						}],
					},
				],
			};

			function done(data) {
				debugger
				var data = _.groupBy(data.data, function(item) { return item.consumible.nombre; });
				var tables = that.tmp_table_datos({data:data});
				that.pnlResultado.html(tables);
			}
			app.ut.request({url:'/inventarios_plantas', data:options, done:done});
		},
		/*-------------------------- Eventos ---------------------------*/
		click_btnbuscar: function() {
			this.form.submit();
		},
	});

	return {view: ViMain};
});