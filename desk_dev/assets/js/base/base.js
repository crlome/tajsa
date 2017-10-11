var _LTracker = _LTracker || [];
_LTracker.push({'logglyKey': 'c60f84b6-502c-4d16-a004-7b4ef06567f1', 'sendConsoleErrors': true, 'tag': 'app-tajsa'});

var config_mask = {
	'fecha': '0000-00-00',
	'fecha_hora': '0000-00-00 00:00',
	'horas': '00:00',
	'numeros': '#',
	'decimalesx': {
		mask: '##############################',
		conf: {
			translation: {
				'#': {
					pattern: /[0-9\.]/
				},
			}
		},
	},
	'decimales': {
		mask: '##0.00',
		conf: {
			reverse: true
		},
	},
	'letras': {
		mask: 'A',
		conf: {
			translation: {
				'A': {
					pattern: /[A-Za-z\sñáéíóúÑÁÉÍÓÚ]/,
					recursive: true
				},
			}
		}
	},
	'rfc': {
		mask: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
		conf: {
			translation: {
				'A': {
					pattern: /[A-Za-z|0-9]/
				},
			}
		}
	},
	'curp': {
		mask: 'AAAA000000YAAAAAZZ',
		conf: {
			translation: {
				'A': {pattern: /[A-Za-z]/},
				'0': {pattern: /[0-9]/},
				'Y': {pattern: /[m|h|M|H]/},
				'Z': {pattern: /[A-Za-z0-9]/},
			}
		}
	},
	'telefono': {
		mask: 'AAAAAAAAAAAAAAAAA',
		conf: {
			translation: {
				'A': {pattern: /[0-9|-]/},
			}
		}
	},
};

var baseURL = 'http://localhost:1337/images/',
//var baseURL = 'http://cecyted.edu.mx:1337/images/',
	bust = '151118';//(new Date()).getTime(),//
	url_imgs = 'images/db_imgs/',
	url_assets = 'images/';

function readURL(input, image) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			if(e.total > 60000)
				app.ut.message({text:'La imagen no puede ser mayor a 60 KB' ,tipo:'warning',});
			else
				image.data('old', 'old').attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function fueraDeServicio() {
	app.ut.message({text:'Error interno, pongase en contacto con el area de sistemas.' ,tipo:'warning',});
}

function bases(){
	jQuery.expr[':'].contains = function(a, i, m) {
		var query = m[3] === undefined ? '' : m[3];
		return jQuery(a).text().toUpperCase().indexOf(query.toUpperCase()) >= 0;
	};

	jQuery.fn.extend({
		doFocus: function() {
			var that = this;
			setTimeout(function() { 
				that.focus();
			}, 1000);
		}
	});

	if (typeof Number.prototype.formatMoney != 'function') {
		// see below for better implementation!
		Number.prototype.formatMoney = function(c, d, t) {
			var n = this, 
			c = isNaN(c = Math.abs(c)) ? 2 : c, 
			d = d == undefined ? "." : d, 
			t = t == undefined ? "," : t, 
			s = n < 0 ? "-" : "", 
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
			j = (j = i.length) > 3 ? j % 3 : 0;
			return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		};
	}

	if (typeof String.prototype.formatMoney != 'function') {
		// see below for better implementation!
		String.prototype.formatMoney = function () {            
			return this.formatMoney();
		};
	}

	if (typeof Array.prototype.chunks != 'function') {
		// see below for better implementation!
		Array.prototype.chunks = function (chunkA){
			if(chunkA > 0) {
				var i, j, temparray = Array();
				for (i=0, j=this.length; i<j; i+=chunkA)
					temparray.push(this.slice(i, i+chunkA));

				return temparray;
			}
			else
				return this;
		
		};
	}
	
	if (typeof Array.prototype.insert != 'function') {
		Array.prototype.insert = function (index, item) {
			this.splice(index, 0, item);
		};
	}

	if (typeof Number.prototype.getDecimals != 'function') {
		// see below for better implementation!
		Number.prototype.getDecimals = function (value){
			var num = this || 0,
				decimales = value || 0;
		
			var tmp = this.toString().split('.');
			var p1 = tmp[0],
				p2 = '';
			if(tmp[1] && decimales > 0)
				p2 = '.' + tmp[1].substr(0, decimales);
		
			return parseFloat(p1 + p2);
		};
	}
	
	if (typeof String.prototype.startsWith != 'function') {
		// see below for better implementation!
		String.prototype.startsWith = function (str){
			return this.indexOf(str) == 0;
		};
	}
	
	if (typeof Number.prototype.round != 'function') {
		// see below for better implementation!
		Number.prototype.round = function (value){
			var num = this || 0,
				decimales = '1',
				tope = value || 0;
			for (var i = 0; i < tope; i++)
				decimales += '0';
			decimales = parseInt(decimales);
		
			return Math.round(parseFloat(num) * decimales) / decimales;
		};
	}

	if (typeof String.prototype.toFloat != 'function') {
		// see below for better implementation!
		String.prototype.toFloat = function (value){
			var val = parseFloat(this);
			return val || value || 0;
		};
	}
	
	if (typeof String.prototype.toInt != 'function') {
		// see below for better implementation!
		String.prototype.toInt = function (value){
			var val = parseInt(this);
			return val || value || 0;
		};
	}

	if (typeof Date.prototype.getCurrentTime != 'function') {
		// see below for better implementation!
		Date.prototype.getCurrentTime = function () {
			var fecha = this,
				horas = fecha.getHours(),
				minutos = fecha.getMinutes();

			horas = horas.toString().length == 1 ? '0' + horas : horas;
			minutos = minutos.toString().length == 1 ? '0' + minutos : minutos;
			
			return horas + ':' + minutos;
		};
	}
	
	if (typeof String.prototype.toShortDate != 'function') {
		// see below for better implementation!
		String.prototype.toShortDate = function (isDate) {
			var str_fecha = this.toString();

			if(!isDate) {
				var indexT = str_fecha.indexOf('T');
				if(indexT > -1) {
					var tmp_fecha = str_fecha.substr(0, indexT);
					str_fecha = tmp_fecha + 'T06:00:00.000Z';
				}
			}
			
			var fecha = new Date(str_fecha),
				anio = fecha.getUTCFullYear(),
				mes = fecha.getUTCMonth() + 1,
				dia = fecha.getUTCDate();        
			dia = dia.toString().length == 1 ? '0' + dia : dia;
			mes = mes.toString().length == 1 ? '0' + mes : mes;
			
			return anio + '-' + mes + '-' + dia;
		};
	}

	if (typeof Date.prototype.toShortDate != 'function') {
		// see below for better implementation!
		Date.prototype.toShortDate = function () {   
			var anio = this.getFullYear(),
				mes = this.getMonth() + 1,
				dia = this.getDate();

			dia = dia.toString().length == 1 ? '0' + dia : dia;
			mes = mes.toString().length == 1 ? '0' + mes : mes;

			return (anio + '-' + mes + '-' + dia + 'T06:00:00.000Z').toString().toShortDate();
		};
	}
}

function utilerias() {
	var __loading = $('.loading'),
		__isLoading = false,
		__petXHR = 0;

	function _WatchLoad() {
		__petXHR--;
		if(__petXHR <= 0) {
			__petXHR = 0;
			Hide();
		}
	}
	
	return {
		cleanstr	: cleanStr,
		confirm 	: Confirm,
		datediff	: DateMeasure,
		get     	: Get,
		getHora    	: GetHora,
		getFecha    : GetFecha,
		getFromUser	: GetFromUser,
		hide    	: Hide,
		handleErr 	: HandleError,
		logging		: logging,
		masks		: Masks,
		meses   	: GetMeses(),
		message 	: Message,
		print   	: Print,
		request 	: Request,
		show    	: Show,
		stringToCss	: StringToCss,
		toWords 	: ToWords,
		tyAhead 	: Typeahead,
	};

	function cleanStr(text) {
		text = text || ''
		var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
		var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
		for (var i=0; i<acentos.length; i++) {
			text = text.replace(acentos.charAt(i), original.charAt(i));
		}
		return text;
	}

	function Masks(panel) {
		var elems = panel.find('[data-mask]');
		for (var i = 0; i < elems.length; i++) {
			var elem = elems.eq(i);
			var mask = elem.data('mask');

			var conf = config_mask[mask];

			if(typeof conf == 'object')
				elem.mask(conf.mask, conf.conf);
			else
				elem.mask(conf);
		}
	}
	
	function GetHora() {
		var fecha = new Date();
		var hora = fecha.getHours().toString();
		var minutos = fecha.getMinutes().toString();

		if(hora.length == 1)
			hora = '0' + hora;
		if(minutos.length == 1)
			minutos = '0' + minutos;

		var horas = hora + ':' + minutos;
		return horas;
	}

	function GetFecha() {
		var fecha = new Date();
		return fecha.toShortDate();
	}

	function GetFromUser(field) {
		var valor = '';
		switch(field) {
			case 'idNivelEducativo':
				valor = app.usuario.actual_nivel_educativo.idNivelEducativo;
				break;
			case 'idPeriodo':
				valor = app.usuario.actual_nivel_educativo.periodo.idPeriodo;
				break;
			case 'idUsuario':
				valor = app.usuario.idUsuario;
				break;
			case 'tipo':
				valor = app.usuario.tipo;
				break;
			default:
				valor = '';
				break;
		}

		return valor
	}

	function logging(json) {
		try {

			if(json.info == null)
				json.info = Object();

			var user = Object();
			if(app.views.main !== undefined)
				user = _.pick(app.views.main.user, 'clave', 'idPlantel', 'idUsuario', 'nombre', 'tipo', 'usuario');

			var jErr = {
				errmsg:json.info.errmsg,
				errnum:json.info.errnum,
				user:user,
				url:json.url,
				hash:window.location.hash,
				data:json.info.data,
				proc:json.info.proc,
				tipo:json.tipo,
				xhrErr:json.xhr ? json.xhr.statusText : '',
				tipo_proc: json.tipo_proc || 'error',
			};

			_LTracker.push(jErr);
		}
		catch(ex) {}
	}

	function StringToCss(css) {
		var subCss = css.split('}');
		var jCss = Object();

		for (var i = 0; i < subCss.length; i++) {
			if(subCss[i].length == 0)
				continue;

			var keyvalue = subCss[i].split('{');
			if(keyvalue.length == 2)
				jCss[keyvalue[0].trim()] = '-webkit-print-color-adjust: exact;' + keyvalue[1].replace(/\s/gi, "");
		}

		// var index = css.indexOf('}');
		// var tmpCss = css;
		// var newCss = '';
		// var arrCss = Array();

		// while(index >= 0) {
		// 	var cssx = tmpCss.substr(0, index + 1);
		// 	arrCss.push(cssx);

		// 	newCss += '.pnl-preview ' + cssx;
		// 	tmpCss = tmpCss.substr(index + 1);

		// 	index = tmpCss.indexOf('}');
		// }

		// var jqHtml = $('<div>' + template(json) + '</div>');

		// var jCss = app.ut.stringToCss(arrCss);

		// var arr = Array();

		// var output = {};
		// for(var k in arr)
		// {
		// 	var value = arr[k].replace(/\s/gi, ""), key, tag;
		// 	// Get key
		// 	value.replace(/(\.|#)*([a-z0-9\s]+){/gi, function($1, $2, $3){
		// 		tag = ($2 || '') + $3.trim();
		// 		key = $3.trim();
		// 	});
		// 	// Make object
		// 	output[key] = {
		// 		tag: tag,
		// 		css: Object(),
		// 	};

		// 	// Replace First part
		// 	value = value.replace(/(\.|#)*([a-z0-9\s]+){/gi, "");
		// 	value = value.replace("}", "");

		// 	output[key].css = '-webkit-print-color-adjust: exact;' + value;

		// 	// value.replace(/([a-z\-]+)([^:]+)?:([^0-9a-z]+)?([^;]+)/g, function($1, $2, $3, $4, $5){             
		// 	// 	output[key].css[$2] = $5;
		// 	// });
		// }

		return jCss;
	}

	function HandleError(data, alert) {
		var _alert = alert == null ? true : alert;
		var tipo = 'alert';
		if(data.errmsg && data.errmsg.length > 0) {
			try {
				logging({info:data, tipo:'handleErr', url:app.currView.url});
			}
			catch(ex) {}

			console.log(data.errmsg);
			var _inErr = '';
			switch(data.errmsg) {
				case 'ORA-01403: no data found':
					_inErr = 'No hay datos que mostrar';
					tipo = 'primary';
					break;
				default:
					_inErr = data.errmsg;
					//_inErr = 'Ocurrió un error interno, consulte al administrador del sistema';

					if(data.errnum == -20001)
						_inErr = data.errmsg;
					break;
			}
		
			app.ut.message({text:_inErr, tipo:tipo});
            return false;
		}
        
        if(!alert)
        	app.ut.message({text:'Registro guardado correctamente', tipo:'success'});
        return true;
	}
	
	function Request(options) {
		var url = options.url,
			type = options.type || 'GET',
			data = options.data || {},
			done = options.done || fnDone,
			err = options.err || fnErr,
			dataType = options.dataType || 'json',
			loading = options.loading !== undefined ? options.loading : true,
			form = options.form || null,
			socket = options.socket || false,
			scope = options.scope || null;

		var jInfoData = data;

		var contentType = 'application/json';
		var jData = null;
		if(form) {
			jData = new FormData(form[0]);
	        jData.append("data", JSON.stringify(data));
	        contentType = false;
		}
		else
			jData = JSON.stringify(data);

		var xhr = null;
		if(socket && app.socket)
			io.socket['get'.toLowerCase()](url, fnNext);
		else{
			if(type == 'GET')
				xhr = $.get(url, data);
			else
				xhr = $.ajax({
					url: url,// + '?&authenticity_token=' + _token,  //Server script to process data
					type: type,
					data: jData,
					//Options to tell jQuery not to process data or worry about content-type.
					dataType: dataType,
					cache: false,
					contentType: contentType,//'application/json',
					processData: false
				});

			xhr.done(fnNext).fail(err).always(always);
		}
		if (loading) {
			__petXHR++;
			if(!__isLoading)
				Show();
		}

		if(scope)
			done = done.bind(scope);

		function fnNext(data) {
			try {
				if(data.errmsg && data.errmsg.length > 0) {
					//data.data = jInfoData;
					logging({info:data, tipo:'ajax', url:app.currView.url});
				}
			}
			catch(ex) {}
			if (loading)
				_WatchLoad();

			done(data);
		}

		function fnDone(data){
			console.log(data);
		}

		function fnErr(xhr, err, x) {
			try {
				if(data.errmsg && data.errmsg.length > 0) {
					data.data = jInfoData;
					logging({info:data, tipo:'ajax', url:app.currView.url});
				}
			}
			catch(ex) {}
			console.log(xhr);
			fueraDeServicio();
		}

		function always(){
			console.log('finish');
			_WatchLoad();
		}
	}

	function hide() {
		$('#loading').fadeOut(function(){
			$(this).addClass('is-hidden')
		});
	}

	// { header, body, dataID, fnA, fnC }
	function Message (json) {
		
		var message = json.text || '',
			auto_close = json.auto_close === undefined ? false : json.auto_close,
			time = json.time || 5000,
			tipo = json.tipo || 'alert',
		alerta = $(app.templates.alerta({texto:message, tipo:tipo}));

		$.fx.speeds.slow = time;

		if(tipo != 'alert')
			auto_close = true;
		
		$('.pnlAlert').prepend(alerta).foundation();

		if(auto_close)
			alerta.fadeOut('slow', function() {
				alerta.find('.close').click();
			});
		else
			setTimeout(function() {
				alerta.find('.close').click();
			}, time);
	}

	// { header, body, dataID, done, cancel }
	function Confirm(json) {
		var modal = json.el || $('#popConfirmacion'),
			validacion = false,
			valores = json || {},
			header = valores.header || 'Confirmar',
			body = valores.body || '/',
			dataID = valores.dataID || 0;

		modal.data('close', true);
		modal.find('.pop-head label').text(header);
		modal.find('.pop-body').html(body);

		modal.find('.btn-aceptar').removeData().data('idKey', dataID).off('click').on('click', fnDone);
		modal.find('.btn-cancelar').off('click').on('click', fnHide);
		modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
			modal.off('close');
			if(valores.done && typeof valores.done === "function")
				valores.done(modal);
			
			if(modal.data('close'))
				modal.foundation('reveal', 'close');
		}

		function fnHide(e) {            
			if(valores.cancel && typeof valores.cancel === "function") {
				valores.cancel();
				modal.off('close');
			}
			if(e.type != 'close')
				modal.foundation('reveal', 'close');
		}
	}
	
	function DateMeasure(ms) {
		var d, h, m, s;
		s = Math.floor(ms / 1000);
		m = Math.floor(s / 60);
		s = s % 60;
		h = Math.floor(m / 60);
		m = m % 60;
		d = Math.floor(h / 24);
		h = h % 24;

		this.days = d;
		this.hours = h;
		this.minutes = m;
		this.seconds = s;
	}
	
	/*
	 * p_url        : url a la cual se va a hacer la peticion
	 * p_data       : objeto tipo JSON que contiene la informacion a mandas
	 * p_done       : funcion que se ejecutara si todo sale bien
	 * p_err        : funcion que se ejecutara si ocurrio algun error
	 * p_type       : tipo de dato que se espera recibir [json, html, text]
	 * p_loading    : true/false para activar o no el loading panel
	 */
	function Get(p_params) {
		var url = p_params.url || '/PVenta',
			done = p_params.done || fnDone,
			err = p_params.err || fnErr,
			type = p_params.type || 'text',
			data = p_params.data || {},
			loading = p_params.loading === undefined ? true : p_params.loading;

		if (loading)
			show();
		$.get(url, data, type).done(fnNext).fail(err);

		function fnNext(data){
			done(data, hide);
		}

		function fnDone(data, fnHide){
			console.log(data);
			fnHide();
		}

		function fnErr(xhr, err, x){
			console.log(xhr);
			if (loading)
				hide();
		}
	}
	
	function GetMeses() {
		var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		return meses;
	}
	
	function Hide(fn, p_arrs) {
		__isLoading = false;
		__loading.fadeOut();
	}
	
	function Print(json) {
		var modal = json.el || $('#popImprimir'),
			body = json.body || '/',
			clase = json.class || '';
		
		$('#print-area').removeClass().addClass(clase).html(body);
		modal.find('#modal-body').removeClass().addClass(clase).html(body);

		modal.find('#btnImprimir').off('click').on('click', fnDone);
		modal.find('#btnCancelar').off('click').on('click', fnHide);
		modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
			modal.off('close');
			window.print();
			modal.foundation('reveal', 'close');
		}

		function fnHide(e) {
			modal.off('close');
			if(e.type != 'close')
				modal.foundation('reveal', 'close');
		}
	}
	
	function Show() {
		var h1 = $(document).height();
		var h2 = $('body').height();
		var h3 = $('html').height();
		var max = 0;
		
		if(h1 > h2 && h1 > h3)
			max = h1;
		else if (h2 > h3)
			max = h2;
		else
			max = h3;
		
		// console.log($(document).height());
		// console.log($('body').height());
		// console.log($('html').height());
		// console.log(max);
		var top = $(document).scrollTop() + 250;
		
		__isLoading = true;
		__loading.css({height:max + 'px'}).fadeIn().children('#topLoader').css({top:top + 'px'});
	}
	
	function ToWords(value) {
		
		function Unidades(num) {
			switch(num)
			{
				case 1: return 'UN';
				case 2: return 'DOS';
				case 3: return 'TRES';
				case 4: return 'CUATRO';
				case 5: return 'CINCO';
				case 6: return 'SEIS';
				case 7: return 'SIETE';
				case 8: return 'OCHO';
				case 9: return 'NUEVE';
			}    
			return '';
		}
		
		function Decenas(num) {
			decena = Math.floor(num/10);
			unidad = num - (decena * 10);
		
			switch(decena)
			{
				case 1:   
					switch(unidad)
					{
						case 0: return 'DIEZ';
						case 1: return 'ONCE';
						case 2: return 'DOCE';
						case 3: return 'TRECE';
						case 4: return 'CATORCE';
						case 5: return 'QUINCE';
						default: return 'DIECI' + Unidades(unidad);
					}
				case 2:
					switch(unidad)
					{
						case 0: return 'VEINTE';
						default: return 'VEINTI' + Unidades(unidad);
					}
				case 3: return DecenasY('TREINTA', unidad);
				case 4: return DecenasY('CUARENTA', unidad);
				case 5: return DecenasY('CINCUENTA', unidad);
				case 6: return DecenasY('SESENTA', unidad);
				case 7: return DecenasY('SETENTA', unidad);
				case 8: return DecenasY('OCHENTA', unidad);
				case 9: return DecenasY('NOVENTA', unidad);
				case 0: return Unidades(unidad);
			}
		}//Unidades()
		
		function DecenasY(strSin, numUnidades) {
			if (numUnidades > 0)
			return strSin + ' Y ' + Unidades(numUnidades)
			
			return strSin;
		}//DecenasY()
		
		function Centenas(num) {
			centenas = Math.floor(num / 100);
			decenas = num - (centenas * 100);
			
			switch(centenas)
			{
				case 1:
					if (decenas > 0)
						return 'CIENTO ' + Decenas(decenas);
					return 'CIEN';
				case 2: return 'DOSCIENTOS ' + Decenas(decenas);
				case 3: return 'TRESCIENTOS ' + Decenas(decenas);
				case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
				case 5: return 'QUINIENTOS ' + Decenas(decenas);
				case 6: return 'SEISCIENTOS ' + Decenas(decenas);
				case 7: return 'SETECIENTOS ' + Decenas(decenas);
				case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
				case 9: return 'NOVECIENTOS ' + Decenas(decenas);
			}
			
			return Decenas(decenas);
		}//Centenas()
		
		function Seccion(num, divisor, strSingular, strPlural) {
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			letras = '';
			
			if (cientos > 0)
				if (cientos > 1)
					letras = Centenas(cientos) + ' ' + strPlural;
			else
				letras = strSingular;
			
			if (resto > 0)
				letras += '';
			
			return letras;
		}//Seccion()
		
		function Miles(num) {
			divisor = 1000;
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			strMiles = Seccion(num, divisor, 'MIL', 'MIL');
			strCentenas = Centenas(resto);
			
			if(strMiles == '')
				return strCentenas;
			
			return strMiles + ' ' + strCentenas;
			
			//return Seccion(num, divisor, 'UN MIL', 'MIL') + ' ' + Centenas(resto);
		}//Miles()
		
		function Millones(num) {
			divisor = 1000000;
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
			strMiles = Miles(resto);
			
			if(strMillones == '')
				return strMiles;
			
			return strMillones + ' ' + strMiles;
			
			//return Seccion(num, divisor, 'UN MILLON', 'MILLONES') + ' ' + Miles(resto);
		}//Millones()
		
		function NumeroALetras(num) {
			var data = {
				numero: num,
				enteros: Math.floor(num),
				centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
				letrasCentavos: '',
				letrasMonedaPlural: 'PESOS',
				letrasMonedaSingular: 'PESO'
			};
		
			if (data.centavos > 0)
				data.letrasCentavos = 'CON ' + data.centavos + '/100 M.N.';
			else
				data.letrasCentavos = 'CON 00/100 M.N.';
				
		
			if(data.enteros == 0)
				return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
			if (data.enteros == 1)
				return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
			else
				return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
		}
		
		return NumeroALetras(value);
	}
	
	function Typeahead(json) {
		var arr = json.arr || [],
			elem = json.elem,
			url = json.url || '',
			displayKey = json.dKey || 'nombre',
			def = json.def || 'select',
			template = json.tmp || app.templates.tyaTmp,
			fail = json.fail || __Fake,
			done = json.done || _FakeAhead,
			includes = json.includes || [],
			_filters = json.filters || [{filter:'nombre'}],
			_where = json.where || [{field:'activo', value:1}],
			_sorts = json.sorts || null,
			_custom = json.custom || null,
			_onSelected = json.onSelected || onSelected,
			_onClean = json.onClean || onClean,
			_callSearch = null,
			_query = null,
			_process = null,
			_timeout = 1,
			_metodo = url.length > 0 ? searchQuery : prepareCollection(),
			_predata = {},
			_xhr = null;
		
		var _template;
		if(typeof json.tmp === 'string' && json.tmp.length > 0) {
			template = Handlebars.compile(json.tmp);
			_template = template;
			displayKey = 'dKey';
		}
		
		elem = elem.typeahead(null, {
			name: 'familias',
			displayKey: displayKey,
			source: _metodo,
			templates: {
				suggestion: template
			}
		})
		.data('dKey', displayKey)
		.on('typeahead:selected typeahead:autocompleted', function(e, datum) {
			var curElem = $(e.currentTarget);
			var value = template(datum) || datum[curElem.data('dKey')];

			curElem.data('current', datum).val(value);
			console.log(datum)
			_onSelected(datum, curElem);
		})
		.on('blur', function(e) {
			var elem = $(e.currentTarget);
			var datum = elem.data('current');

			if(elem.length > 0 && !datum) {
				datum = _.find(_predata, function(item) {
					return item.dKey.toUpperCase() == elem.val().toUpperCase();
				});

				if(datum)
					elem.data('current', datum);
			}
			
			if(datum) {
				var value = template(datum) || datum[elem.data('dKey')];
				datum.dKey = value;
				elem.val(datum.dKey);
				parent.find('.tya-clear').css({display:'inline-block'});
			}
			else {
				elem.val('');
				parent.find('.tya-clear').css({display:'none'});
			}

			_predata = {};
		});
		
		if(elem.parents('label').length == 1 && elem.parents('label').next('small').length == 1)
			elem.parents('.twitter-typeahead').append(elem.parents('label').next('small'));

		var parent = elem.parents('.twitter-typeahead');
		parent.find('.tt-hint').attr('readonly', 'readonly').removeAttr('required').removeAttr('data-field').removeAttr('data-include').removeClass('tya');//.remove();
		parent.append('<i class="icon-search tya-search"></i>');
		parent.append('<i class="icon-cross tya-clear"></i>');
		parent.append('<i class="icon-spinner tya-loading icon-spin"></i>');
		
		parent.on('click', '.tya-clear', function() {
			_clean();
		});

		parent.on('click', '.tya-search', function(e) {
			e.preventDefault();
			//app.views.main.open_hya(elem);
		});

		function _clean() {
			elem.data('current', null).val('');
			parent.find('.tya-clear').css({display:'none'});
			_onClean();
		}

		function _current(option) {
			var res = null;
			if(option && elem.data('current'))
				res = elem.data('current')[option] || null;
			else if(!option)
				res = elem.data('current') || null;
			return res;
		}

		function onSelected(data) {
			console.log('on selected');
		}

		function onClean(data) {
			console.log('on clean');
		}
		
		function execQuery() {
			if(_callSearch)
				clearTimeout(_callSearch);
			
			fSeacrh();
		}
		
		function fSeacrh(jData) {
			var __isCustom = jData && typeof jData.done === 'function';

			parent.find('.tya-loading').css({display:'inline-block'});
			console.log('init');
			var __where = [];
			if(_where)
				for (var i = 0; i < _where.length; i++) {
					var w = {field:_where[i].field, to:'v'};
	                if(_where[i].to == 'u')
	                    w.to = 'u';
					else if(typeof _where[i].value === 'function')
						w.value = _where[i].value(elem);
					else
						w.value = _where[i].value;
					
					__where.push(w);
				}
			else
				__where = null;

			if(_xhr != null && _xhr.readyState != 4)
				_xhr.abort();

			_query = elem.val();
			if(jData && jData.query)
				_query = jData.query;

			var __params = {
				query:_query, 
				filters:_filters, 
				where:__where, 
				sorts:_sorts, 
				custom:_custom, 
				displayKey: displayKey, 
				def: def,
				includes:includes
			};

			if(__isCustom) {
				__params.page = jData.page;
				__params.pageSize = jData.pageSize;
			}

			_xhr = $.get('/controles/tya?model=' + url, __params).done(wrapDone).fail(wrapFail).always(always);
			
			function always() {
				app.ut.hide();

				parent.find('.tya-loading').css({display:'none'});
				console.log('fin');
				_query = null;
				_callSearch = null;
			}
			function wrapFail(xhr, err) {
				fail(xhr, err);
			}
			function wrapDone(data) {
				if(data.errmsg.length > 0 || data.data.length == 0)
					app.ut.message({text:'No se encontraron datos en la busqueda', tipo:'primary'});
				
				for (var i = 0; i < data.data.length; i++)
					data.data[i].dKey = data.data[i][displayKey];

				if(__isCustom)
					jData.done(data);
				else
					done(data.data, _process, displayKey, template);
			}
		}
		
		function prepareCollection() {
			var nombres = new Bloodhound({
			  datumTokenizer: function(datum) {
				  return Bloodhound.tokenizers.whitespace(datum.dKey); 
			  },
			  queryTokenizer: Bloodhound.tokenizers.whitespace,
			  local: arr
			});
			
			nombres.initialize();
			
			return nombres.ttAdapter();
		}
		
		function searchQuery(query, process) {
			_query = query;
			_process = process;
			
			console.log(query);
			if(_callSearch)
				clearTimeout(_callSearch);
			
			_callSearch = setTimeout(fSeacrh, _timeout);
		}
		
		function selectSource() {
			return url.length > 0 ? searchQuery : prepareCollection();
		}
		
		function _FakeAhead(data, process, displayKey) {
			for (var i = 0; i < data.length; i++) {
				data[i].dKey = data[i][displayKey];
			}

			_predata = data;
			process(data);
		}

		function setCurrent(datum) {
			datum['dKey'] = datum[elem.data('dKey')];

			elem.data('current', datum).val(datum['dKey']);
			elem.blur();
			_onSelected(datum, elem);
		}

		var __exports = {
			execQuery: execQuery,
			fSeacrh: fSeacrh,
			clean: _clean,
			template: _template,
			current: _current,
			setCurrent: setCurrent,
		};
		elem.data('fn', __exports);

		if(elem.data('bytemp') === true) {
			var currData = elem.data('fn').current();
			if(currData && currData.length > 0)
				elem.data('current', JSON.parse(currData.replace(/\'/g, '\"')));
			elem.blur();
		}
		
		return __exports;
	}
	
	function __Fake(xhr) {
		console.log(xhr);
	}
}

function loadAsync(options) {
	var modulo = options.mod || 'index',
		dependencias = options.deps || [],
		params_init = options.params_init,
		params_render = options.params_render;

	app.ut.show();
	app.currView.close();
	
	var dirsJS = ['/templates/' + modulo + '.js?bust='+bust];

	for(var i=0; i<dependencias.length; i++) {
		dirsJS.push('/templates/' + dependencias[i] + '.js?bust='+bust);
	}

	var dfd = $.Deferred();

	if(!app.views[modulo]) {
		require(['text!/templates/' + modulo + '.html'], function(data) {
			if(app.views.noAccess && data == '-1') {
				app.currView = app.views.noAccess;
				app.currView.render();
			}
			else {
				if(data.length == 0)
					fueraDeServicio();

				// if(data == '-1') {
				// 	modulo = 'noAccess';
				// 	dirsJS = ['/templates/views/noAccess.js'];

				// 	app.load_content.append(app.views.main.tmp_frm_noaccess({}));
				// }
				// else
				// 	app.load_content.append(data);

				var html = $(data).appendTo(app.load_content);
				html.find('.date').datetimepicker({
					timepicker: false,
					format: 'Y-m-d'
				}).mask('0000-00-00');

				html.find('.datetime').datetimepicker({
					timepicker: true,
					format: 'Y-m-d H:i'
				});

				require(dirsJS, function (async) {
					app.currView = app.views[modulo] || (app.views[modulo] = new async.view(params_init));
					app.currView.render(params_render);
					//load foundation
					app.currView.$el.foundation();
					//$(document).foundation()
					
					dfd.resolve(app.currView);
				});
			}
		});
	}
	else {
		app.currView = app.views[modulo];
		app.currView.render(params_render);

		dfd.resolve(app.currView);
		app.ut.hide();
	}
	

	dfd.then(function(async) {
		app.ut.hide();
	});
	
	return dfd.promise;
}

define([], function () {
	//$.ajaxSetup({ cache: false });

	return {bases:bases, utilerias:utilerias, loadAsync:loadAsync};
});