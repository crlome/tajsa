var baseURL = 'http://localhost:1337/images/';
//var baseURL = 'http://cecyted.edu.mx:1337/images/';

function templates(){
	Handlebars.registerHelper('SetFormat', function(format, value, decs) {
		var resultado = '';
		var cond = format || '',
			decimales = typeof decs === 'number' ? decs : 2;
		switch (format) {
			case 'money':
				resultado = (value || 0).formatMoney(decimales, '.', ',');
				break;
			default:
				resultado = (value || 0);
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('SetTya', function(data, dField, dKey, include) {
		var key = data[dField];

		if(key == null) {
			var tya = '<input type="text" data-field="' + dField + '" data-bytemp="true" data-include="' + include + '" data-dKey="' + dKey + '" class="tya" placeholder="Nombre del registro"/>';
			return new Handlebars.SafeString(tya);
		}

		var jData = data[include];
		jData[dField] = key;

		var dkeys = dKey.split('+'),
			arrDKey = Array();
		for (var i = 0; i < dkeys.length; i++) {
			arrDKey.push(jData[dkeys[i]]);
		}

		jData.dKey = arrDKey.join(' ');

		var current = JSON.stringify(jData).replace(/\"/g, '\'');
		if(jData[dField])
			str = 'data-current="' + current + '" value="' + jData.dKey + '"';
		else
			str = '';

		var tya = '<input type="text" data-field="' + dField + '" data-bytemp="true" data-include="' + include + '" data-dKey="' + dKey + '" ' + str + ' class="tya" placeholder="Nombre del registro"/>';

		return new Handlebars.SafeString(tya);
	});

	Handlebars.registerHelper('GetFechaActual', function() {
		var resultado = new Date();
		
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetUrlServicio', function(id, tipo) {
		var resultado = '';
		switch (id.toString()) {
			case '2':
				resultado = tipo == 1 ? 'rpt_muestreo_concreto' : 'rpt_muestreo_concreto';
				break;
			case '3':
				resultado = tipo == 1 ? 'rpt_muestra_humedad' : 'rpt_muestra_humedad';
				break;
			default:
				resultado = tipo == 1 ? 'rpt_terracerias' : 'frm_terracerias';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetEstatusPad', function(id, tipo) {
		var estatus = '';
		switch (id.toString()) {
			case '0':
				estatus = 'Pendiente'
				break;
			case '1':
				estatus = 'Atrasado'
				break;
			case '2':
				estatus = 'Pagado'
				break;
			default:
				estatus = 'Cancelado'
				break;
		}
		return new Handlebars.SafeString(estatus);
	});

	Handlebars.registerHelper('GetTipoControl', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Vivienda';
				break;
			default:
				resultado = 'General';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetTipoAsfalto', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'AC-20';
				break;
			case '2':
				resultado = 'AC-20 MODIFICADO';
				break;
			case '3':
				resultado = 'MODIFICADO';
				break;
			case '4':
				resultado = 'MAQUILA MODIFICADO';
				break;
			case '5':
				resultado = 'AC-30';
				break;
			case '6':
				resultado = 'AC-30 MODIFICADO';
				break;
			case '7':
				resultado = 'PG-70-22';
				break;
			case '8':
				resultado = 'PG-76-22';
				break;
			default:
				resultado = '';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetEstatusOS', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Abierta';
				break;
			case '2':
				resultado = 'Cerrada';
				break;
			default:
				resultado = 'Cancelada';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('isNull', function(val, options) {
		debugger
		if(val === null) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('ifCond', function(val1, val2, options) {
		if(val1 === val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('ifCondAlt', function(val1, val2, condicion, options) {
		var res;
		switch(condicion) {
			case '!=':
				if(val1 != val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
			case '>=':
				if(val1 >= val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
			case '<=':
				if(val1 <= val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
			case '>':
				if(val1 > val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
			case '<':
				if(val1 < val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
			default:
				if(val1 === val2)
					res = options.fn(this);
				else
					res = options.inverse(this);
				break;
		}

		return res;
	});

	Handlebars.registerHelper('unlessCond', function(val1, val2, options) {
		if(val1 !== val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('stringify', function(data) {
		var current = JSON.stringify(data).replace(/\"/g, '\'');
		return new Handlebars.SafeString(current);
	});
	
	Handlebars.registerHelper('ToWords', function(numero) {
		var res = app.ut.toWords(numero);

		return new Handlebars.SafeString(res);
	});
	
	Handlebars.registerHelper('GetSuma', function(	val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, 
													val11, val12, val13, val14, val15, val16, val17, val18, val19, val20) {
		var suma = 0;
		for (var i = 0; i < arguments.length-1; i++) {
			suma += parseFloat(arguments[i] || 0);
		}

		return suma;
	});
	
	Handlebars.registerHelper('GetFecha', function(fecha) {
		if(!fecha)
			return '';

		// var tmpFecha = new Date(fecha);

		// var dia = tmpFecha.getDate() + 1,
		// 	mes = tmpFecha.getMonth() + 1,
		// 	anio = tmpFecha.getFullYear().toString();

		// dia = dia.toString();
		// mes = mes.toString();
		// anio = anio.toString();
		
		// var strFecha = anio + '-' + (mes.length == 1 ? '0' + mes : mes) + '-' + (dia.length == 1 ? '0' + dia : dia);
		var strFecha = fecha.toShortDate();
		return strFecha;
	});
	
	Handlebars.registerHelper('GetFechaLetra', function(fecha) {
		if(!fecha)
			return '';
		//var tmpFecha = new Date(fecha);
		var partes = fecha.toShortDate().split('-');

		var dia = partes[2],
			mes = [1],
			anio = [0];
			
		var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio','Julio','Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		var strFecha = dia + ' de ' + meses[mes] + ' de ' + anio;
		return strFecha;
	});

	Handlebars.registerHelper('GetTipo', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Entrada';
				break;
			case '2':
				resultado = 'Salida';
				break;
			default:
				resultado = 'Anterior';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetTipoMaquina', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Diesel';
				break;
			default:
				resultado = 'Gasolina';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetTipoConsumbible', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Diesel';
				break;
			case '2':
				resultado = 'Gasolina';
				break;
			case '3':
				resultado = 'Lubricante';
				break;
			case '4':
				resultado = 'Combustible';
				break;
			case '5':
				resultado = 'Gas';
				break;
			case '6':
				resultado = 'Asfalto';
				break;
			default:
				resultado = 'Otro';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetTipoProduccion', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Otro';
				break;
			default:
				resultado = 'Planta';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('GetTipoUtilizado', function(tipo) {
		var resultado = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				resultado = 'Tendido';
				break;
			default:
				resultado = 'Suministrado';
				break;
		}
		return new Handlebars.SafeString(resultado);
	});

	Handlebars.registerHelper('notCol', function(key, options) {
		if(key.startsWith('id'))
			return options.inverse(this);

		var cols = ['created_at', 'updated_at', 'rownum', 'dKey', 'activo', 'contrasenia'];
		if(_.contains(cols, key))
			return options.inverse(this);
		return options.fn(this);
	});
	
	Handlebars.registerHelper('toJSON', function(data) {
		var json = JSON.stringify(data);
		jParse = json.replace(/"/g, '|');

		return new Handlebars.SafeString(jParse);
	});
	
	Handlebars.registerHelper('SetDefatult', function(val1, val2) {
		return new Handlebars.SafeString(val1 === undefined || val1 === null ? val2 : val1);
	});

	var alerta = Handlebars.compile('<div class="alert-box {{tipo}} special altMenssage pop-alert" data-alert="data-alert"><span class="spnTexto">{{texto}}<a class="close" href="#">×</a></span></div>'),
		cbo = Handlebars.compile('{{#data}} <option value="{{_id}}">{{nombre}}</option> {{/data}}'),
		tyaBase = Handlebars.compile('NT-{{sku}} - {{nombre}}'),
		tyaTmp = Handlebars.compile('{{dKey}}')
		;
	return {        
		alerta: alerta,
		tyaBase: tyaBase,
		tyaTmp: tyaTmp,
		cbo: cbo,
	}
}

define([], function () {
	return templates;
});