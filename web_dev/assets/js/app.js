var ViBody = Backbone.View.extend({ 
	el:'body',
	events: {
		'click nav ul.menu-n1 > li > a': 'click_menun1',
		'click nav ul.menu-n2 > li > a': 'click_menun2',
		'click .menu, .wrap-layer': 'click_open_menu',
		'keyup .txtBusqueda': 'keyup_txtBusqueda',
		'click #load_content': 'click_open_userMOD',
		'click .menuOpen': 'click_open_user',
		'click .btn-sync': 'click_btnsync',
	},
	initialize: function(options) {
		this.user = null;
		this.txtBusqueda = this.$el.find('.txtBusqueda');
		this.infoUser = this.$el.find('section.info-user');

		this.lblUsuario = this.$el.find('.lblUsuario');
		this.infoPlantel = this.$el.find('.info-plantel');

		//this.checkLogin();

		this.modalHelperTya = this.$el.find('#popHelperTya');
		this.popHelperTya = new ViHelperTya({parentView:this, el:this.modalHelperTya});

		this.$el.find('.datetime').datetimepicker({
			format: 'Y-m-d'
		}).mask('0000-00-00');
	},
	/*-------------------------- Base --------------------------*/
	print: function(options) {
		var that = this;
		this.$el.find('.pnl-print').html(options.elem.html());
		window.print();
	},
	checkLogin: function() {
		var that = this;
		
		var elem = this.$el.find('.is-used-user');
		this.user = elem.data('info');
		elem.remove();

		app.ut.request({url:'/sesiones/getUser', done:function(data) {
			if(!data)
				window.location.href = '/sesiones/logout';
			else
				that.infoPlantel.text(data.clave + ' - ' + data.nombrePlantel);
			// 	that.render_menu(data)
		}});
	},
	open_hya: function(elem) {
		this.popHelperTya.render(elem);
	},
	sync: function() {
		function done(data) {
			if(app.ut.handleErr(data, true))
				app.ut.message({text:'Datos actualizados correctamente', tipo:'success'});
		}
		app.ut.request({url:'/sync', done:done});
	},
	/*-------------------------- Eventos --------------------------*/
	click_menun1: function(e) {
		// var elem = $(e.currentTarget);


		// return
		var elem = $(e.currentTarget).parents('li');

		elem.siblings('li.isActive').removeClass('isActive').children('ul.menu-n2').slideUp().children('li.isActive').removeClass('isActive');

		if(elem.hasClass('isActive')) {
			elem.removeClass('isActive').children('ul.menu-n2').slideUp().children('li.isActive').removeClass('isActive');
			e.preventDefault();
		}
		else if(elem.hasClass('has-submenu')) {
			e.preventDefault();
			elem.addClass('isActive').children('ul.menu-n2').slideDown();
			// if(elem.hasClass('isActive'))
			// 	return;
		}
		else
			elem.addClass('isActive');
	},
	click_menun2: function(e) {
		var elem = $(e.currentTarget).parent('li');

		elem.siblings('li.isActive').removeClass('isActive');        
		elem.addClass('isActive');

		if(window.location.hash === elem.find('a').attr('href')) {
			e.preventDefault();
			return;
		}
	},
	click_open_menu: function(e) {
		$('nav, main, .wrap-layer').toggleClass('is-menu-open');
		$('.menu').toggleClass('selected');

		if($('nav, main, .wrap-layer').hasClass('is-menu-open')) {
			this.txtBusqueda.val('');
			this.keyup_txtBusqueda({currentTarget:this.txtBusqueda});
		}
	},
	click_open_user: function(e) {
		$('.user-menu').toggleClass('user-data-open');
	},		
	click_open_userMOD: function(e) {
		$('.user-menu').removeClass('user-data-open');		
	},
	keyup_txtBusqueda: function(e) {
		var busqueda = $(e.currentTarget).val();

		if(busqueda.length > 0) {
			$('ul.menu-n1').addClass('is-hidden');
			$('ul.search-n1').removeClass('is-hidden');

			var lis = $('ul.search-n1 li:not(:contains("' + busqueda + '"))');

			$('ul.search-n1 li').removeClass('is-hidden');
			lis.addClass('is-hidden');
		}
		else {
			$('ul.menu-n1').removeClass('is-hidden');
			$('ul.search-n1').addClass('is-hidden');
		}
	},
	click_btnsync: function() {
		var that = this;
		function done() {
			that.sync();
		}
		app.ut.confirm({body:'¿Desea iniciar la actualizacion de informacion?', done:done});
	},
});

var ViHelperTya = Backbone.View.extend({ 
	el:'#popHelperTya',
	events: {
		'click .btn-cancelar': 'click_btncancelar',
		'click table .prev-hya': 'click_table_prevhya',
		'click table .next-hya': 'click_table_nexthya',
		'click table tbody tr': 'click_table_tbody_tr',
	},
	initialize: function(options) {
		this.options = options;
		
		this.tyaElem = null;

		this.tmp_table_hya = Handlebars.compile(this.options.parentView.$el.find('.tmp_table_hya').html());
		this.gvHya = this.options.parentView.$el.find('.gv-hya');

		this.page = 1;
		this.pageSize = 10;
		this.isTheEnd = false;

		this.query = null;
	},
	/*-------------------------- Base --------------------------*/
	render: function(tyaElem) {
		this.$el.foundation('reveal', 'open');
		this.tyaElem = tyaElem;

		this.exec();
	},
	close: function() {
		this.$el.foundation('reveal', 'close');
		this.tyaElem = null;

		this.page = 1;
		this.isTheEnd = false;
		this.gvHya.html('');
	},
	exec: function() {
		var that = this;
		app.ut.show();

		function done(data) {
			if(data && data.data && data.data.length > 0) {
				var keys = _.filter(_.keys(data.data[0]), function(item) { return !(item.startsWith('id') || item == 'created_at' || item == 'updated_at' || item == 'rownum' || item == 'dKey' || item == 'activo' || item == 'contrasenia'); })

				var table_content = that.tmp_table_hya({keys:keys, rows:data.data, long:keys.length});

				that.gvHya.html(table_content);

				that.isTheEnd = false;
				if(that.page == 1)
					that.gvHya.find('.prev-hya').addClass('is-hidden');
				
				if(data.max >= data.total) {
					that.gvHya.find('.next-hya').addClass('is-hidden');
					that.isTheEnd = true;
				}
			}
		}
		this.tyaElem.data('fn').fSeacrh({done:done, query:this.query, page:this.page, pageSize:this.pageSize});
	},
	/*-------------------------- Eventos --------------------------*/
	click_btncancelar: function() {
		this.close();
	},
	click_table_prevhya: function(e) {
		e.preventDefault();

		if(this.page == 1)
			return;

		this.page--;
		if(this.page < 1)
			this.page = 1;

		this.gvHya.find('.next-hya').removeClass('is-hidden');
		this.exec();
	},
	click_table_nexthya: function(e) {
		e.preventDefault();

		if(this.isTheEnd)
			return;

		this.page++;
		this.gvHya.find('.prev-hya').removeClass('is-hidden');
		this.exec();
	},
	click_table_tbody_tr: function(e) {
		var json = JSON.parse($(e.currentTarget).data('info').replace(/\|/gi, '"'));
		this.tyaElem.data('fn').setCurrent(json);
		this.close();
	},
});

define([], function () {
	return ViBody;
}); 
