define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMain = viewsBase.base.extend({
		el: '#cierres',
		events:{
			'click .btn-cierre': 'click_btncierre',
			'focus .gv-gases input': 'focus_gvgases_input',
		},
		initialize: function() {
			var that = this;
			this.form = this.$el.find('.form-data');
			this.gvResultado = this.$el.find('.gv-resultado');
			this.gvGases = this.$el.find('.gv-gases');

			this.tmp_tr_gases = Handlebars.compile(this.$el.find('.tmp_tr_gases').html());
			this.tmp_tr_produccion = Handlebars.compile(this.$el.find('.tmp_tr_produccion').html());

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.presave();
			}).on('submit', function (e) {
				e.preventDefault();
			});

			app.ut.masks(this.$el);
		},
		/*-------------------------- Base ---------------------------*/
		render: function() {
			var that = this;
			viewsBase.abc.prototype.render.call(this);
			this.$el.find('[data-field="fecha"]').val((new Date).toShortDate());

			function done_gases(data) {
				if(data.data.length > 0){
					var trs = that.tmp_tr_gases(data);
					that.gvGases.find('tbody').html(trs);
				}
			}
			app.ut.request({url:'/consumibles', data:{where:{tipo:5, idPlanta:{to:'u'}}}, done:done_gases});
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		presave: function() {
			var that = this;
			var json = viewsBase.base.prototype.getData.call(this, this.form);
			var gases = viewsBase.base.prototype.getData.call(this, this.gvGases.parent('div'));

			if(json.fecha > (new Date()).toShortDate()) {
				app.ut.message({text:'La fecha de cierre no puede ser mayor a la fecha actual'});
				this.$el.find('[data-field="fecha"]').select();
				return;
			}

			json.gases = _.filter(gases.gases, function(item) { return parseFloat(item.cantidad, 10) > 0; }) || Array();

			function done() {
				that.save(json);
			}
			if(json.gases.length == 0)
				app.ut.confirm({body:'La cantidad de gas consumido es 0, ¿desea proseguir?', done:done});
			else
				done();
		},
		save: function(json) {
			var that = this;			

			function done(data) {
				if(app.ut.handleErr(data)) {
					// var trs = that.tmp_tr_produccion(data);
					// that.gvResultado.html(trs);
					that.form[0].reset();
					app.router.navigate('reporteDiario?idCierre='+data.cierre.idCierre, {trigger: true});
				}
			}
			app.ut.request({url:'/cierres', data:json, done:done, type:'POST'});
		},
		/*-------------------------- Eventos ---------------------------*/
		click_btncierre: function() {
			this.form.submit();
		},
		focus_gvgases_input: function(e) {
			$(e.currentTarget).select();
		},
	});

	return {view: ViMain};
});