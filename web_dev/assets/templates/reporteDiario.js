define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMain = viewsBase.base.extend({
		el: '#reporteDiario',
		events:{
			'change [data-field="idCierre"]': 'change_cbocierre',
			'click .pnl-menu a': 'click_pnlmenu_a',
			'click .pnl-materiales table tbody tr': 'click_pnlmateriales_table_tbody_tr',
			'click .pnl-emulsiones table tbody tr': 'click_pnlemulsiones_table_tbody_tr',
			'click .pnl-consumibles table tbody tr': 'click_pnlconsumibles_table_tbody_tr',
		},
		initialize: function() {
			var that = this;
			this.form = this.$el.find('.form-data');
			this.pnlResumen = this.$el.find('.pnl-resumen');
			this.pnlDetalle = this.$el.find('.pnl-detalle');
			this.pnlGrafica = this.$el.find('.pnl-grafica');
			this.pnlMateriales = this.$el.find('.pnl-materiales');
			this.pnlEmulsiones = this.$el.find('.pnl-emulsiones');
			this.pnlConsumibles = this.$el.find('.pnl-consumibles');
			this.pnlMenu = this.$el.find('.pnl-menu');

			this.tmp_table_resumen = Handlebars.compile(this.$el.find('.tmp_table_resumen').html());
			this.tmp_table_produccion = Handlebars.compile(this.$el.find('.tmp_table_produccion').html());
			this.tmp_option_cierres = Handlebars.compile(this.$el.find('.tmp_option_cierres').html());
			this.tmp_table_materiales = Handlebars.compile(this.$el.find('.tmp_table_materiales').html());
			this.tmp_table_emulsiones = Handlebars.compile(this.$el.find('.tmp_table_emulsiones').html());
			this.tmp_table_consumibles = Handlebars.compile(this.$el.find('.tmp_table_consumibles').html());

			this.popDetalle = new ViDetalle({parentView:this, el:this.$el.find('.modal-detalle')});
			this.idCierre;
		},
		/*-------------------------- Base ---------------------------*/
		render: function(joptions) {
			var that = this;
			viewsBase.abc.prototype.render.call(this);

			function done(data) {
				var options = that.tmp_option_cierres(data);
				that.$el.find('[data-field="idCierre"]').html(options);

				if(joptions.idCierre > 0)
					that.$el.find('[data-field="idCierre"]').val(joptions.idCierre).change();
			}
			app.ut.request({url:'/cierres', data:{where:{activo:1}, order:[['idCierre', 'DESC']]}, done:done});
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*-------------------------- Eventos ---------------------------*/
		change_cbocierre: function(e) {
			var that = this;
			var idCierre = $(e.currentTarget).val();
			if(idCierre != -1 && idCierre != this.idCierre) {
				this.pnlMenu.find('a').eq(0).click();
				this.idCierre = idCierre;

				function done(data) {
					debugger
					var pregrupos = _.groupBy(data.data, function(item) {
						return item.idConsumible + '::' + item.tipo_asfalto;
					});

					var resumenes = Array();

					var grupos = Array();
					for(var key in pregrupos) {
						var curr = _.sortBy(pregrupos[key], function(item) { return item.tipo == 3 ? 0 : item.tipo; });
						var nombre_consumible = null;
						var tipo_consumible = null;
						if(curr[0].consumible){
							nombre_consumible =  curr[0].consumible.nombre + ' ' + Handlebars.helpers.GetTipoAsfalto(curr[0].tipo_asfalto);
							tipo_consumible = curr[0].consumible.tipo;
						}
						var resumen = {
							consumible: nombre_consumible,
							tipo: tipo_consumible,
							anterior: 0,
							entradas: 0,
							salidas: 0,
							actual: 0,
						};

						for (var i = 0; i < curr.length; i++) {
							var row = curr[i];
							switch(row.tipo) {
								case 3:
									resumen.anterior += (parseFloat(row.cantidad) || 0);
									break;
								case 2:
									resumen.salidas += (parseFloat(row.cantidad) || 0);
									break;
								default:
									resumen.entradas += (parseFloat(row.cantidad) || 0);
									break;
							}

						}
						resumen.actual = resumen.anterior + resumen.entradas - resumen.salidas;
						if(curr[0].consumible)
							resumenes.push(resumen);

						var total_cantidad = _.reduce(curr, function(memo, item) {
							return memo + ((item.tipo == 2 ? -1 : 1) * item.cantidad);
						}, 0);

						var total_metros = _.reduce(curr, function(memo, item) {
							return memo + item.metros;
						}, 0);

						var jdata = {
							consumible: nombre_consumible,
							data:curr,
							total: {
								cantidad: total_cantidad,
								metros: total_metros,
							},
						};
						if(curr[0].consumible)
							grupos.push(jdata);
					}

					var table_det = that.tmp_table_produccion({tablas:grupos});
					var table_res = that.tmp_table_resumen({data:resumenes});

					that.pnlDetalle.html(table_det);
					that.pnlResumen.html(table_res);

					var no_gases = _.filter(resumenes, function(item) { return item.tipo != 5; });
					var si_gases = _.filter(resumenes, function(item) { return item.tipo == 5; });

					var categories = _.pluck(no_gases, 'consumible');
					var serie_anterior = {
						name: 'Anterior',
						data: _.pluck(no_gases, 'anterior'),
					}, serie_entradas = {
						name: 'Entradas',
						data: _.pluck(no_gases, 'entradas'),
					}, serie_salidas = {
						name: 'Salidas',
						data: _.pluck(no_gases, 'salidas'),
					}, serie_actual = {
						name: 'Actual',
						data: _.pluck(no_gases, 'actual'),
					};

					var series = [serie_anterior, serie_entradas, serie_salidas, serie_actual];
					var cierre = that.$el.find('[data-field="idCierre"] option:selected').text();

					that.pnlResumen.find('.grf-resumen').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: 'Produccion de cierre'
						},
						subtitle: {
							text: cierre
						},
						xAxis: {
							categories: categories,
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: ''
							}
						},
						// tooltip: {
						// 	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						// 	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						// 		'<td style="padding:0"><b>{point.y:.1f} m³</b></td></tr>',
						// 	footerFormat: '</table>',
						// 	shared: true,
						// 	useHTML: true
						// },
						plotOptions: {
							column: {
								pointPadding: 0.05,
								borderWidth: 0
							}
						},
						series: series
					});

					categories = _.pluck(si_gases, 'consumible');
					serie_anterior = {
						name: 'Anterior',
						data: _.pluck(si_gases, 'anterior'),
					}, serie_entradas = {
						name: 'Entradas',
						data: _.pluck(si_gases, 'entradas'),
					}, serie_salidas = {
						name: 'Salidas',
						data: _.pluck(si_gases, 'salidas'),
					}, serie_actual = {
						name: 'Actual',
						data: _.pluck(si_gases, 'actual'),
					};

					series = [serie_anterior, serie_entradas, serie_salidas, serie_actual];

					that.pnlResumen.find('.grf-gas').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: 'Produccion de cierre'
						},
						subtitle: {
							text: cierre
						},
						xAxis: {
							categories: categories,
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: '%'
							}
						},
						// tooltip: {
						// 	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						// 	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						// 		'<td style="padding:0"><b>{point.y:.1f} m³</b></td></tr>',
						// 	footerFormat: '</table>',
						// 	shared: true,
						// 	useHTML: true
						// },
						plotOptions: {
							column: {
								pointPadding: 0.05,
								borderWidth: 0
							}
						},
						series: series
					});

					that.pnlMenu.removeClass('is-hidden');

					function done_producciones(data) {
						var total = _.reduce(data.data, function(memo, item) { return memo + (item.cantidad || 0) }, 0);
						that.$el.find('.spn-produccion').text(total);

						var trs = that.pnlResumen.find('.gv-resumen tbody tr');
						for (var i = 0; i < trs.length; i++) {
							var tr = trs.eq(i);
							var salidas = (tr.find('.td-salidas').text().replace(/[\,]/gi, '')) || 0;
							var prom = (parseFloat(salidas || 0) / total).toFixed(2);
							tr.find('.td-prod-cub').text(prom);
						}
					}
					var options = {
						where:{idCierre:that.idCierre},
					};
					app.ut.request({url:'/producciones', data:options, done:done_producciones});
				}
				var options = {
					where:{idCierre:this.idCierre},
					includes: [
						{model:'consumibles', as:'consumible'}, 
						{	model:'producciones',
							as:'produccion',
							includes: [{
								model:'obras',
								as:'obra',
							}/*,{
								model:'inventarios_materiales',
								as:'inventarios_materiales',
								includes: [{
									model:'materiales',
									as:'material'
								}] 
							}*/],
						},
					],
					order: ['fecha', 'hora'],
				};
				app.ut.request({url:'/inventarios_plantas', data:options, done:done});
				
				function done_materiales(data) {
					var table = that.tmp_table_materiales(data);

					that.pnlMateriales.html(table);

					var cierre = that.$el.find('[data-field="idCierre"] option:selected').text();
					
					var categories = _.pluck(data.data, 'material');
					var serie_anterior = {
						name: 'Anterior',
						data: _.pluck(data.data, 'anterior'),
					}, serie_entradas = {
						name: 'Entradas',
						data: _.pluck(data.data, 'entradas'),
					}, serie_salidas = {
						name: 'Salidas',
						data: _.pluck(data.data, 'salidas'),
					}, serie_actual = {
						name: 'Actual',
						data: _.pluck(data.data, 'actual'),
					};

					series = [serie_anterior, serie_entradas, serie_salidas, serie_actual];

					that.pnlMateriales.find('.grf-grafica').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: 'Produccion de cierre'
						},
						subtitle: {
							text: cierre
						},
						xAxis: {
							categories: categories,
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: 'm³'
							}
						},
						plotOptions: {
							column: {
								pointPadding: 0.05,
								borderWidth: 0
							}
						},
						series: series
					});
				}
				app.ut.request({url:'/inventarios_materiales/existencias', data:{idCierre:idCierre}, done:done_materiales});

				function done_emulsiones(data) {
					var table = that.tmp_table_emulsiones(data);

					that.pnlEmulsiones.html(table);

					var cierre = that.$el.find('[data-field="idCierre"] option:selected').text();

					var categories = ['IMPREGNACIONES'];
					var serie_anterior = {
						name: 'Anterior',
						data: _.pluck(data.data, 'anterior'),
					}, serie_entradas = {
						name: 'Entradas',
						data: _.pluck(data.data, 'entradas'),
					}, serie_salidas = {
						name: 'Salidas',
						data: _.pluck(data.data, 'salidas'),
					}, serie_actual = {
						name: 'Actual',
						data: _.pluck(data.data, 'actual'),
					};

					series = [serie_anterior, serie_entradas, serie_salidas, serie_actual];

					that.pnlEmulsiones.find('.grf-grafica').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: 'Produccion de cierre'
						},
						subtitle: {
							text: cierre
						},
						xAxis: {
							categories: categories,
							crosshair: true
						},
						yAxis: {
							title: {
								text: 'Litros'
							}
						},
						plotOptions: {
							column: {
								pointPadding: 0.05,
								borderWidth: 0
							}
						},
						series: series
					});
				}
				app.ut.request({url:'/inventarios_emulsiones/existencias', data:{idCierre:idCierre}, done:done_emulsiones});

				function done_consumibles(data) {
					var table = that.tmp_table_consumibles(data);

					that.pnlConsumibles.html(table);

					var cierre = that.$el.find('[data-field="idCierre"] option:selected').text();

					var categories = _.pluck(data.data, 'consumible');
					var serie_anterior = {
						name: 'Anterior',
						data: _.pluck(data.data, 'anterior'),
					}, serie_entradas = {
						name: 'Entradas',
						data: _.pluck(data.data, 'entradas'),
					}, serie_salidas = {
						name: 'Salidas',
						data: _.pluck(data.data, 'salidas'),
					}, serie_actual = {
						name: 'Actual',
						data: _.pluck(data.data, 'actual'),
					};

					series = [serie_anterior, serie_entradas, serie_salidas, serie_actual];

					that.pnlConsumibles.find('.grf-consumibles').highcharts({
						chart: {
							type: 'column'
						},
						title: {
							text: 'Produccion de cierre'
						},
						subtitle: {
							text: cierre
						},
						xAxis: {
							categories: categories,
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: 'Litros'
							}
						},
						plotOptions: {
							column: {
								pointPadding: 0.05,
								borderWidth: 0
							}
						},
						series: series
					});
				}
				app.ut.request({url:'/inventarios_consumibles/existencias', data:{idCierre:idCierre}, done:done_consumibles});
			}
		},
		click_pnlmenu_a: function(e) {
			e.preventDefault();
			var elem = $(e.currentTarget);
			elem.parents('ul').find('li').removeClass('current');
			elem.parents('li').addClass('current');

			this.$el.find('.pnl-panels').addClass('is-hidden');
			var ePanel = elem.parents('li').data('panel');
			this.$el.find('.pnl-panels.' + ePanel).removeClass('is-hidden');;
		},
		click_pnlconsumibles_table_tbody_tr: function(e) {
			var id = $(e.currentTarget).data('id');
			
			var json = {
				where: {
					idConsumible: id,
					idCierre: this.idCierre,
				},
				includes: [
					{model:'obras', as:'obra'},
				],
				order: ['fecha', 'hora', 'tipo'],
			};
			this.popDetalle.render(json, 'consumibles', '/inventarios_consumibles');
		},
		click_pnlemulsiones_table_tbody_tr: function(e) {
			var json = {
				where: {
					idCierre: this.idCierre,
				},
				includes: [
					{model:'clientes', as:'cliente'},
				],
				order: ['fecha', 'hora', 'tipo'],
			};
			this.popDetalle.render(json, 'emulsiones', '/inventarios_emulsiones');
		},
		click_pnlmateriales_table_tbody_tr: function(e) {
			var id = $(e.currentTarget).data('id');
			
			var json = {
				where: {
					idMaterial: id,
					idCierre: this.idCierre,
				},
				includes: [
					{
						model:'producciones', 
						as:'produccion',
						includes: [
							{model:'clientes', as:'cliente'},
							{model:'obras', as:'obra'},
							{model:'productos', as:'producto'},
						],
					},
					{ model:'clientes', as:'cliente' },
					{ model:'obras', as:'obra' },
				],
				order: ['fecha', 'hora', 'tipo'],
			};
			this.popDetalle.render(json, 'materiales', '/inventarios_materiales');
		},
	});

	var ViDetalle = viewsBase.base.extend({
		events: {
			'click .btn-cancelar': 'click_btncancelar',
		},
		initialize: function() {
			this.gvDetalle = this.$el.find('.gv-detalle');

			this.tmp_pop_table_consumibles = Handlebars.compile(this.options.parentView.$el.find('.tmp_pop_table_consumibles').html());
			this.tmp_pop_table_emulsiones = Handlebars.compile(this.options.parentView.$el.find('.tmp_pop_table_emulsiones').html());
			this.tmp_pop_table_materiales = Handlebars.compile(this.options.parentView.$el.find('.tmp_pop_table_materiales').html());
		},
		/*-------------------------- Base ---------------------------*/
		render: function(json, seccion, url) {
			var that = this;
			this.$el.foundation('reveal', 'open');

			function done(data) {
				var table = that['tmp_pop_table_' + seccion](data);
				that.gvDetalle.html(table);
			}
			
			app.ut.request({url:url, data:json, done:done});
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		/*-------------------------- Eventos ---------------------------*/
		click_btncancelar: function() {
			this.close();
		},
	});

	return {view: ViMain};
});