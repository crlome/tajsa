var bust = (new Date()).getTime();//'151118';//

// requirejs.onError = function (err) {
// 	debugger
// };

require.config({
	waitSeconds: 3000,
	//urlArgs: "bust=" + (new Date()).getTime(),
	paths: {		
		'jquery'		: '/js/deps/jquery-2.2.3.min',
		'datetimepicker': '/js/deps/jquery.datetimepicker',
		'highcharts'	: '/js/graf/highcharts',
		'mask'			: '/js/deps/jquery.mask',
		'lodash'		: '/js/deps/lodash.underscore.min',
		'backbone'		: '/js/deps/backbone-min',
		'modernizr'		: '/js/deps/modernizr',
		'foundation'	: '/js/deps/foundation.min_v5',
		// 'socketio'		: '/js/deps/socket.io',

		'handlebars'	: '/js/deps/handlebars',

		'typeahead'		: '/js/deps/typeahead',
		'text'			: '/js/deps/text',

		'controles'		: '/js/base/controles',
		'router'		: '/js/base/router',
		'base'			: '/js/base/base',
		'templates'		: '/js/base/templates',
		'app'			: '/js/app',
		

		'rollbar'			: '/js/deps/rollbar',
	},
	shim: {
		'lodash'		: { exports:'_' },

		'datetimepicker': { deps:['jquery'] },
		'mask'			: { deps:['jquery'] },
		'highcharts'	: { deps:['jquery'] },
		'modernizr'		: { deps:['jquery'] },
		'typeahead'		: { deps:['jquery'] },
		
		'backbone'		: { deps:['lodash', 'jquery'] },
		'foundation'	: { deps:['modernizr', 'jquery'] },

		'controles'		: { deps:['backbone', 'jquery'] },
		'base'			: { deps:['backbone', 'jquery'] },
		'router'		: { deps:['backbone', 'jquery'] },
		'app'			: { deps:['backbone', 'jquery'] },
	}
});

require([
	// 'socketio',
	'jquery',
	'lodash',
	'modernizr',

	'datetimepicker',
	'mask',
	'highcharts',

	'backbone',
	'foundation',

	'handlebars',
	'text',
	'templates',

	'typeahead',
	'base',
	
	'controles',
	'base',
	'router',
	'app',

	'rollbar'
], function (
	// socketio,
	jquery,
	lodash,
	modernizr,

	datetimepicker,
	mask,
	highcharts,
	
	backbone,
	foundation,

	handlebars,
	text,
	templates,

	typeahead,
	base,
	
	controles,
	base,
	router,
	view_app,

	rollbar
	) {

	// var socket = socketio(window.location.origin);
	// socket.on('news', function (data) {
	// 	console.log(data);
	// 	socket.emit('my other event', { my: 'data' });
	// });

	var app = {
		views: {},
		loadAsync: base.loadAsync,
		ut: new base.utilerias(),
		load_content: $('#load_content'),
		templates: {},
		controles: controles.controles,
		models: controles.models,
		collections: controles.coGrid,
		servicios: {},
		currView: {
			close: function() {},
			$el: $('div'),
		},
		socket: {},
	};

	window.app = app;
	
	base.bases();
	app.templates = new templates();

	// $(document).ajaxComplete(function(event, request, settings) {
	//   	if(request.status == 500) { 
	// 		app.ut.logging({tipo:'ajax:'+settings.type, url:settings.url});
	// 		alert('Sesion caducada, vuelva a iniciar sesion');
	// 		window.location.href = '/sesiones/logout';
	// 	}
	// });

	$(document).foundation({
		reveal: {
			close_on_background_click: false,
			multiple_opened: true,
		},
		abide : {
			live_validate : true,
			validate_on_blur : true,
			timeout : 1000,
			patterns: {
				curp: /^[a-zA-Z]{4}[0-9]{6}[m|h|M|H][a-zA-Z]{2}[a-zA-Z]{3}[a-zA-Z0-9][0-9]$/,
				decimales: /^[0-9]+(\.[0-9][0-9]?)?$/,
				numeros: /^[0-9]+$/,
				horas: /^[0-9]{2}\:[0-9]{2}$/,
				fechas: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
				string: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
				clave: /^[A-Z\d]+$/,
				email: /^[\w\-\.0-9]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2,3})?$/,
				rfc: /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
			}
		},
	});
	$(document).foundation('reflow');
	app.views['main'] = new view_app();

	app.router = new router;
	Backbone.history.start({
		root: '/',
	});

	app.usuario = window.usuario;

	app.ut.hide();

	console.log('ok');
});