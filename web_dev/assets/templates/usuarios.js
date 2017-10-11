var MoModel = Backbone.Model.extend({
	defaults: {
		idUsuario 		: 0,
		idPlanta		: 0,
		nombre 			: '',
		usuario			: '',
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
		el: '#usuarios',
		events: {
			'click .btn-extras': 'click_btnextras',
		},
		initialize: function() {
			this.pk = 'idUsuario';
			this.url = '/usuarios';
			this.model = MoModel;

			this.fks = {
				idPlanta: {
					url: 'plantas',
				},
			};

			this.extras = {
				includes: [
					{model:'plantas', as:'planta'},
				],
			};

			this.extras = {
				includes: [{model:'plantas', as:'planta'}],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:300},
				{nombre:'Usuario', field:'usuario', width:300},
				{nombre:'Planta', field:'planta', width:400, tmp:'{{nombre}}', join:{table:'plantas', as:'planta', field:'nombre'}},
			];

			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popExtras = new ViPopExtras({parentView:this, el:this.$el.find('.modal-extras')});
		},
		click_btnextras: function() {
			var row = this.tbody.find('.isSelected');
			if(row.length == 0)
				app.ut.message({text:'Tiene que seleccionar un registro' ,tipo:'warning',});
			else {
				var model = this.gvGrid.collection.get(row.data('cid'));
				this.popExtras.render({model:model});
			}
		},
	});

	var ViPopExtras = Backbone.View.extend({
		events: {
			'click .btn-aceptar'    : 'click_aceptar',
			'click .btn-cancelar'   : 'click_cancelar',
			'click .btn-agregar'   : 'click_btnagregar',
			'click .pnl-options a'   : 'click_pnloptions_a',
			'click .list-menus .nivel-n1 > label input'   : 'click_listmenus_niveln1_label_input',
			'click .list-menus .nivel-n2 input'   : 'click_listmenus_niveln2_input',
		},
		initialize: function(data) {
			var that = this;
			this.$el.foundation();
			this.form = this.$el.find('form');

			this.tmp_li_menus = Handlebars.compile(this.options.parentView.$el.find('.tmp_li_menus').html());
			this.tmp_tr_plnatas = Handlebars.compile(this.options.parentView.$el.find('.tmp_tr_plnatas').html());

			this.pnlMenus = this.$el.find('.pnl-menus');
			this.pnlPlantas = this.$el.find('.pnl-plantas');
			this.pnlOptions = this.$el.find('.pnl-options');

			this.gvPlantas = this.pnlPlantas.find('.gv-plantas');

			this.form.foundation().on('valid.fndtn.abide', function (e) {
				e.preventDefault();
				that.save();
			}).on('submit', function (e) {
				e.preventDefault();
			});

			this.fks = {
				idPlanta: {
					url: 'plantas',
				},
			};

			var tyas = this.form.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);
		},		
		/*-------------------------- Base ---------------------------*/
		render: function(data) {
			this.model = data.model;
			var that = this;
			this.$el.foundation('reveal', 'open');

			function done(data) {
				var lis = that.tmp_li_menus(data);
				that.pnlMenus.find('.list-menus').html(lis);

				that.check_menus(that.pnlMenus.find('.list-menus'));

				setTimeout(function() {
					var max_height = 0;
					var elems = that.pnlMenus.find('.army-equelize');
					for (var i = 0; i < elems.length; i++) {
						height = elems.eq(i).height();
						if(height > max_height)
							max_height = height;
					}

					for (var i = 0; i < elems.length; i++)
						elems.eq(i).height(max_height);
				}, 300);
			}
			app.ut.request({url:'/usuarios/menus', data:{idUsuario:this.model.get('idUsuario')}, done:done});
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		getData: function(data) {
			var json = viewsBase.popAbc.prototype.getData.call(this, this.form);
			return json;
		},
		save: function() {
			var that = this;
			var json = {
				idUsuario: this.model.get('idUsuario'),
				menus: Array(),
			};
			var inputs = this.pnlMenus.find('.nivel-n2 input:checked');
			var menus = Array();
			for (var i = 0; i < inputs.length; i++) {
				var input = inputs.eq(i);
				menus.push({idMenuPagina:input.data('id'), idUsuario:json.idUsuario});
			}
			json.menus = menus;

			function done(data) {
				if(app.ut.handleErr(data, true))
					that.close();
			}
			app.ut.request({url:'/usuarios/extras', data:json, done:done, type:'POST'});
		},
		check_menus: function(panel) {
			var lis_n1 = panel.find('.nivel-n1');
			for (var i = 0; i < lis_n1.length; i++) {
				var li = lis_n1.eq(i);
				var total_checked = li.find('.nivel-n2 input:checked').length;
				var total_inputs = li.find('.nivel-n2 input').length;

				li.children('label').find('input').prop('indeterminate', false);
				if(total_checked == 0)
					li.children('label').find('input').prop('checked', false);
				else if(total_inputs == total_checked)
					li.children('label').find('input').prop('checked', true);
				else
					li.children('label').find('input').prop('indeterminate', true);
			}
		},
		/*-------------------------- Eventos ---------------------------*/
		click_aceptar: function() {
			this.form.submit();
		},
		click_cancelar: function() {
			this.$el.foundation('reveal', 'close');
		},
		click_btnagregar: function() {
			debugger
			var that = this;
			var planta = this.tyas.tyaidPlanta.data('fn').current();

			//var find_tr = this.gvPlantas.find('tbody')
			
			var tr = that.tmp_tr_plnatas({data:planta});
			that.gvPlantas.find('tbody').prepend(tr);
			that.tyas.tyaidPlanta.data('fn').clean();
		},
		click_pnloptions_a: function(e) {
			e.preventDefault();
			var elem = $(e.currentTarget);
			var li = elem.parent('li');
			var panel = elem.attr('href');

			if(li.hasClass('unavailable'))
				return;

			this.pnlOptions.find('li').removeClass('current');
			li.addClass('current');

			this.$el.find('.pnl-panels').addClass('is-hidden');
			this.$el.find('.' + panel).removeClass('is-hidden');
		},
		click_listmenus_niveln1_label_input: function(e) {
			var elem = $(e.currentTarget);
			var inputs = elem.parents('li').find('li input');

			inputs.prop('checked', elem.prop('checked'));
		},
		click_listmenus_niveln2_input: function(e) {
			var panel = $(e.currentTarget).parents('.menus-list');
			this.check_menus(panel);
		},
	});
	return {view: ViMain};
});