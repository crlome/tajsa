define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMain = viewsBase.base.extend({
		el: '#producciones',
		events:{
			'click .btn-agregar': 'click_btnagregar',
			'click .gv-producciones .ico-modificar': 'click_gv_modificar',
			'click .gv-producciones .ico-cancelar': 'click_gv_eliminar',
			'dblclick .gv-producciones tbody td:not(.settings)'   : 'click_gv_modificar',
		},
		initialize: function() {
			this.tmp_tr_produccion = Handlebars.compile(this.$el.find('.tmp_tr_produccion').html());
			this.gvProducciones = this.$el.find('.gv-producciones');

			this.popProduccion = new ViProduccion({parentView:this, el:this.$el.find('.modal-save')});
		},
		/*-------------------------- Base ---------------------------*/
		render: function() {
			var that = this;
			viewsBase.abc.prototype.render.call(this);

			function done(data) {
				var trs = that.tmp_tr_produccion({data:data.data});

				that.gvProducciones.find('tbody').html(trs);
				that.render_total();
			}
			var options = {
				where: {
					idCierre: 'null',
					idPlanta:{to:'u'}
				},
				includes:[
					{model:'productos', as:'producto'},
					{model:'clientes', as:'cliente'},
					{model:'obras', as:'obra'},
					{model:'empleados', as:'empleado'},
				],
			};
			app.ut.request({url:'/producciones', data:options, done:done});
		},
		render_total: function() {
			var trs = this.gvProducciones.find('.cantidad');
			var total = 0;
			for (var i = 0; i < trs.length; i++)
				total += parseFloat(trs.eq(i).text() || 0);

			this.gvProducciones.find('tfoot .total').text(total);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		renderRow: function(crud, data) {
			if(crud == 1) {
				var tr = this.tmp_tr_produccion({data:data});
				this.gvProducciones.find('tbody').prepend(tr);
			}
			else {
				var tr = this.tmp_tr_produccion({data:data});
				var tr_old = this.gvProducciones.find('tbody tr[data-idproduccion="' + data.idProduccion + '"]');
				tr_old.html($(tr).html());
				tr_old.data('json', Handlebars.helpers.stringify(data).toString());
			}
			this.render_total();
		},
		/*-------------------------- Eventos ---------------------------*/
		click_btnagregar: function() {
			this.popProduccion.render({crud:1});
		},
		click_gv_modificar: function(e) {
			var tr = $(e.currentTarget).parents('tr');
			var json = JSON.parse(tr.data('json').replace(/\'/gi, '"'));
			this.popProduccion.render({crud:2, data:json});
		},
		click_gv_eliminar: function(e) {
			var that = this;
			var tr = $(e.currentTarget).parents('tr');
			var json = JSON.parse(tr.data('json').replace(/\'/gi, '"'));

			app.ut.confirm({body:'¿Desea eliminar el registro?', done:function() {
				function done(data) {
					if(app.ut.handleErr(data, true)) {
						app.ut.message({text:'El registro se elimino correctamente', tipo:'success'});
						tr.remove();
						that.render_total();
					}
				}
				app.ut.request({url:'/producciones/' + json.idProduccion, data:{delete:1}, done:done, type:'DELETE'});
			}});
		},
	});

	var ViProduccion = Backbone.View.extend({
		events: {
			'click .btn-aceptar'    : 'click_aceptar',
			'click .btn-cancelar'   : 'click_cancelar',
			'focus .gv-consumibles input': 'focus_gvconsumibles_input',
		},
		initialize: function() {
			var that = this;
			this.$el.on('close.fndtn.reveal', function () {
				that.clean();
			});

			this.form = this.$el.find('.form-data');

			this.fks = {
				idProducto: {
					url: 'productos',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
					onSelected: function(data ,element){
						function done(data) {
							var trs = that.tmp_tr_consumibles(data);
							that.gvConsumibles.find('tbody').append(trs);
						}
						var json = {
							includes: [
								{model:'consumibles', as:'consumible'}
							],
							where: {
								idProducto: data.idProducto,
							}
						};
						app.ut.request({url:'/productos_consumibles', data:json, done:done});
					},
					onClean: function(){
						that.gvConsumibles.find('tbody').html('');
					},
				},
				idObra: {
					url: 'obras',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
				},
				idCliente: {
					url: 'clientes',
					where:[{field:'activo', value:1}, {field:'idPlanta', to:'u'}],
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
			this.crud = 1;
			this.idProduccion = 0;

			this.gvConsumibles = this.$el.find('.gv-consumibles');
			this.tmp_tr_consumibles = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_consumibles').html());
		},
		/*------------------------- Base -----------------------------*/
		render: function(json) {
			var that = this;
			this.$el.foundation('reveal', 'open');

			if(json.crud == 1) {
				//this.$el.find('.edit-disable').removeAttr('disabled');
				this.crud = 1;

				var fecha = new Date();
				this.$el.find('[data-field="fecha"]').val(fecha.toShortDate());

				/*function done(data) {
					if(data.data.length > 0){
						var trs = that.tmp_tr_consumibles(data);
						that.gvConsumibles.find('tbody').html(trs);
					}
				}
				var options = {
					where: {
						idConfiguracion: this.idConfiguracion,
						activo: 1,
						idPlanta:{to:'u'}
					},
					includes: [
						{model:'consumibles', as:'consumible'},
					],
				};
				app.ut.request({url:'/configuraciones_detalles', data:options, done:done});*/
			}
			else {
				this.crud = 2;
				//this.$el.find('.edit-disable:not(.tt-hint)').attr('disabled', 'disabled');
				viewsBase.base.prototype.setData(json.data, this.form);
				this.idProduccion = json.data.idProduccion;

				function done_invs(data) {
					if(data.data.length > 0){
						var trs = that.tmp_tr_consumibles(data);
						that.gvConsumibles.find('tbody').html(trs);

						// for (var i = 0; i < data.data.length; i++) {
						// 	var row = data.data[i];
						// 	that.gvConsumibles.find('tbody tr [data-value="' + row.idConsumible + '"]').parents('tr').find('select').val(row.tipo_asfalto);
						// }
					}
				}
				var options = {
					where: {
						idProduccion: this.idProduccion
					},
					includes: [
						{model:'consumibles', as:'consumible'},
					],
				};
				app.ut.request({url:'/inventarios_plantas', data:options, done:done_invs});
			}
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
			this.clean();
		},
		clean: function() {
			this.form[0].reset();
			this.crud = 1;
			this.idProduccion = 0;
			//this.$el.find('.edit-disable').removeAttr('disable');

			var tyas = this.$el.find('.tya.tt-input');
			for (var i=0; i<tyas.length; i++) {
				tyas.eq(i).data('fn').clean();
			}
		},
		clean_and_continue: function() {
			this.tyas.tyaidCliente.data('fn').clean();
			this.tyas.tyaidObra.data('fn').clean();
			this.$el.find('[data-field="tipo"]').val(1);
			this.$el.find('[data-field="cantidad"]').val(0);

			var valores = this.gvConsumibles.find('tbody tr [data-valor]');
			for (var i = 0; i < valores.length; i++) {
				var elem_valor = valores.eq(i);
				var valor = elem_valor.data('valor');
				elem_valor.val(valor);
			}
		},
		getData: function() {
			var json = viewsBase.base.prototype.getData.call(this, this.form);
			return json;
		},
		save: function() {
			var that = this;
			var json = this.getData();

			var url = '/producciones',
				type = 'POST';

			if(this.crud == 2) {
				url += '/' + this.idProduccion;
				type = 'PUT';
			}

			function done(data) {
				if(app.ut.handleErr(data)) {
					// if(that.crud == 1) {
					// 	data.data.cliente = that.tyas.tyaidCliente.data('fn').current();
					// 	data.data.producto = that.tyas.tyaidProducto.data('fn').current();
					// 	data.data.obra = that.tyas.tyaidObra.data('fn').current();
					// 	//data.data.empleado = that.tyas.tyaidEmpleado.data('fn').current();

					// 	//that.clean_and_continue();
					// }

					data.data.cliente = that.tyas.tyaidCliente.data('fn').current();
					data.data.producto = that.tyas.tyaidProducto.data('fn').current();
					data.data.obra = that.tyas.tyaidObra.data('fn').current();

					that.options.parentView.renderRow(that.crud, data.data);
					that.close();
				}
			}
			app.ut.request({url:url, data:json, done:done, type:type});
		},
		/*------------------------- Eventos -----------------------------*/
		click_aceptar: function() {
			this.form.submit();
		},
		click_cancelar: function() {
			this.close();
		},
		focus_gvconsumibles_input: function(e) {
			$(e.currentTarget).select();
		},
	});

	return {view: ViMain};
});
