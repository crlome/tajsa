var MoModel = Backbone.Model.extend({
	defaults: {
		idProducto	 	: 0,
		nombre 	 		:'',
		precio	 		: 0,
		observaciones 	:'',
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
		el: '#productos',
		events: {
			'click .btn-composicion': 'click_btncomposicion',
			'click .btn-consumible': 'click_btnconsumible',
		},
		initialize: function() {
			this.pk = 'idProducto';
			this.url = '/productos';
			this.model = MoModel;

			this.extras = {
				clean: ['nombre','precio','observaciones'],
			};

			this.popComposicion = new ViComposicion({parentView:this, el:this.$el.find('.modal-composicion')});
			this.popConsumible = new ViConsumible({parentView:this, el:this.$el.find('.modal-consumible')});

			var columns = [
				{nombre:'Nombre', field:'nombre', width:400},
				{nombre:'Obeservaciones', field:'observaciones', width:600},
			];

			var specials = [
				{field:'idPlanta', to:'u'},
			];

			viewsBase.abc.prototype.initialize.call(this, columns, null, specials);

			this.popAction.mode = {
				getPlanta: true
			};
		},
		click_btncomposicion: function() {
			var row = this.tbody.find('.isSelected');
			if(row.length == 0)
				app.ut.message({text:'Tiene que seleccionar un registro' ,tipo:'warning',});
			else {
				var model = this.gvGrid.collection.get(row.data('cid'));
				this.popComposicion.render({model:model});
			}
		},
		click_btnconsumible: function() {
			var row = this.tbody.find('.isSelected');
			if(row.length == 0)
				app.ut.message({text:'Tiene que seleccionar un registro' ,tipo:'warning',});
			else {
				var model = this.gvGrid.collection.get(row.data('cid'));
				this.popConsumible.render({model:model});
			}
		},
	});

	var ViComposicion = viewsBase.popAbc.extend({
		events: {
			'click .btn-aceptar'    : 'click_aceptar',
			'click .btn-cancelar'   : 'click_cancelar',
			'click .btn-agregar'   : 'click_agregar',
			'click .i-eliminar'   : 'click_ieliminar',
		},
		initialize: function() {
			var that = this;
			this.form = this.$el.find('.form-data');
			this.gvComposiciones = this.$el.find('.gv-composiciones');

			this.fks = {
				idMaterial: {
					url: 'materiales',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			var tyas = this.form.find('.tya');
			this.linkFks(tyas, this.fks);

			this.tmp_material = Handlebars.compile(this.options.parentView.$el.find('.tmp_material').html());

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.save();
			}).on('submit', function (e) {
				e.preventDefault();
			});

			this.model = null;
			app.ut.masks(this.$el);
		},
		/*------------------------- Base -----------------------------*/
		render: function(options) {
			var that = this;
			this.$el.foundation('reveal', 'open');
			this.model = options.model;

			function done(data) {
				var tr = that.tmp_material({data:data.data});
				that.gvComposiciones.find('tbody').html(tr);
			}
			var json = {
				includes: [
					{model:'materiales', as:'material'}
				],
				where: {
					idProducto:this.model.get('idProducto')
				}
			};
			app.ut.request({url:'/composiciones', data:json, done:done});
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		save: function() {
			var that = this;
			var json = viewsBase.base.prototype.getData.call(this, this.form);
			json.idPlanta = {to:'u'};
			json.idProducto = this.model.get('idProducto');

			var tr_mat = this.gvComposiciones.find('tbody tr[data-idmaterial="' + json.idMaterial + '"]');
			if(tr_mat.length > 0) {
				app.ut.message({text:'No se puede agregar dos veces el mismo material', tipo:'warning'});
				this.tyas.tyaidMaterial.data('fn').clean();
				this.tyas.tyaidMaterial.focus();
				return;
			}

			var trs = this.gvComposiciones.find('tbody .porcentaje');
			var suma = 0;
			for (var i = 0; i < trs.length; i++) {
				suma += parseFloat(trs.eq(i).text() || 0);
			}

			if(suma + parseFloat(json.porcentaje || 0) > 100) {
				app.ut.message({text:'La suma de los porcentajes no puede ser mayor a 100', tipo:'warning'});
				return;
			}

			function done(data) {
				if(app.ut.handleErr(data, true)) {
					json.material = that.tyas.tyaidMaterial.data('fn').current();
					json.idComposicion = data.data.idComposicion;

					var tr = that.tmp_material({data:json});
					that.form[0].reset();
					that.tyas.tyaidMaterial.data('fn').clean();

					that.gvComposiciones.find('tbody').prepend(tr);
				}
			}
			app.ut.request({url:'/composiciones', data:json, done:done, type:'POST'});
		},
		/*------------------------- Eventos -----------------------------*/
		click_aceptar: function() {
			this.form.submit();
		},
		click_cancelar: function() {
			this.$el.foundation('reveal', 'close');
		},
		click_agregar: function() {
			this.form.submit();
		},
		click_ieliminar: function(e) {
			var tr = $(e.currentTarget).parents('tr');
			var idComposicion = tr.data('idcomposicion');

			function done(data) {
				if(app.ut.handleErr(data, true))
					tr.remove();
			}
			app.ut.request({url:'/composiciones/' + idComposicion, data:{delete:1}, done:done, type:'DELETE'});
		},
	});

	var ViConsumible = viewsBase.popAbc.extend({
		events: {
			'click .btn-aceptar'    : 'click_aceptar',
			'click .btn-cancelar'   : 'click_cancelar',
			'click .btn-agregar'   : 'click_agregar',
			'click .i-eliminar'   : 'click_ieliminar',
		},
		initialize: function() {
			var that = this;
			this.form = this.$el.find('.form-data');
			this.gvConsumibles = this.$el.find('.gv-consumibles');

			this.fks = {
				idConsumible: {
					url: 'consumibles',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
			};

			var tyas = this.form.find('.tya');
			this.linkFks(tyas, this.fks);

			this.tmp_consumible = Handlebars.compile(this.options.parentView.$el.find('.tmp_consumible').html());

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.save();
			}).on('submit', function (e) {
				e.preventDefault();
			});

			this.model = null;
			app.ut.masks(this.$el);
		},
		/*------------------------- Base -----------------------------*/
		render: function(options) {
			var that = this;
			this.$el.foundation('reveal', 'open');
			this.model = options.model;

			function done(data) {
				var tr = that.tmp_consumible({data:data.data});
				that.gvConsumibles.find('tbody').html(tr);
			}
			var json = {
				includes: [
					{model:'consumibles', as:'consumible'}
				],
				where: {
					idProducto:this.model.get('idProducto')
				}
			};
			app.ut.request({url:'/productos_consumibles', data:json, done:done});
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		save: function() {
			var that = this;
			var json = viewsBase.base.prototype.getData.call(this, this.form);
			json.idPlanta = {to:'u'};
			json.idProducto = this.model.get('idProducto');

			var tr_mat = this.gvConsumibles.find('tbody tr[data-idconsumible="' + json.idConsumible + '"]');
			if(tr_mat.length > 0) {
				app.ut.message({text:'No se puede agregar dos veces el mismo consumible', tipo:'warning'});
				this.tyas.tyaidConsumible.data('fn').clean();
				this.tyas.tyaidConsumible.focus();
				return;
			}

			/*var trs = this.gvConsumibles.find('tbody .porcentaje');
			var suma = 0;
			for (var i = 0; i < trs.length; i++) {
				suma += parseFloat(trs.eq(i).text() || 0);
			}

			if(suma + parseFloat(json.porcentaje || 0) > 100) {
				app.ut.message({text:'La suma de los porcentajes no puede ser mayor a 100', tipo:'warning'});
				return;
			}*/

			function done(data) {
				if(app.ut.handleErr(data, true)) {
					json.consumible = that.tyas.tyaidConsumible.data('fn').current();
					json.idProductoConsumible = data.data.idProductoConsumible;

					var tr = that.tmp_consumible({data:json});
					that.form[0].reset();
					that.tyas.tyaidConsumible.data('fn').clean();

					that.gvConsumibles.find('tbody').prepend(tr);
				}
			}
			app.ut.request({url:'/productos_consumibles', data:json, done:done, type:'POST'});
		},
		/*------------------------- Eventos -----------------------------*/
		click_aceptar: function() {
			this.form.submit();
		},
		click_cancelar: function() {
			this.$el.foundation('reveal', 'close');
		},
		click_agregar: function() {
			this.form.submit();
		},
		click_ieliminar: function(e) {
			var tr = $(e.currentTarget).parents('tr');
			var idProductoConsumible = tr.data('idproductoconsumible');

			function done(data) {
				if(app.ut.handleErr(data, true))
					tr.remove();
			}
			app.ut.request({url:'/productos_consumibles/' + idProductoConsumible, data:{delete:1}, done:done, type:'DELETE'});
		},
	});

	return {view: ViMain};
});