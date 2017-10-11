var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	
	async = require('async'),
	lodash = require('lodash'),
	socketio = require('socket.io'),
	passport = require('passport');
	LocalStrategy = require('passport-local').Strategy,
	argv = require('minimist')(process.argv.slice(2))
	;

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + '/assets'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	usernameField: 'user',
	passwordField: 'pass'
	}, function(user, pass, done) {
		//console.log('local Strategy: ', user, pass);
		var usuario = {
			usuario: user,
			contrasenia: pass,
		};

		army.db.usuarios.findOne({
			where: usuario,
			include: [
				{
					model:army.db.menus_usuarios,
					as:'menus_usuarios',
					attributes: ['idMenuPagina'],
					include: [
						{
							model:army.db.menus_paginas,
							as:'menu_pagina',
							attributes: ['pagina'],
							include: [
								{
									model:army.db.menus_n2,
									as:'menu_n2',
									attributes: ['nombre'],
								},
								{
									model:army.db.menus_n1,
									as:'menu_n1',
									attributes: ['nombre', 'icono'],
								}
							],
						}
					],
				}
			],
		}).then(function(data, err) {
			console.log('authenticate: ', data, err);
			if(err || data == null)
				return done('El usuario y/o la contraseña con son correctos');

			data = data.toJSON();
			var grupo = army._.groupBy(data.menus_usuarios, function(item) {
				return item.menu_pagina.menu_n1.icono + '::' + item.menu_pagina.menu_n1.nombre;
			});

			data.menus_usuarios = grupo;
			
			return done(null, data);
		});
}));
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

console.log('process.env: ', argv);
var port = argv.port || 3000;
server.listen(port);
// app.listen(port, function () {
// 	console.log('Example app listening on port: ', port);
// });

var army = {
	getCurrTime: function() {
		var date = new Date();
		var horas = date.getHours().toString(),
			minutos = date.getMinutes().toString();
		var hora = (horas.length == 1 ? '0' + horas : horas) + ':' + (minutos.length == 1 ? '0' + minutos : minutos);
		return hora;
	},
	setParamVal: function(where, row, session) {
		if(row.value instanceof Object)
			row = army._.merge(row, row.value);

		if(row.to == 'u'/* && req.session.user.tipo != 7*/)
			where[row.field] = session.user[row.field];
		else if(row.value == 'null')
			where[row.field] = null;
		else
			where[row.field] = row.value;
	},
	_: lodash,
	app: app,
	async: async,
	db: {},
	passport: passport,
	services: {},
	io: socketio(server),
	config: {
		idPlanta: 1,
	},
	tipos: {
		entrada: 1,
		salida: 2,
		cierre: 3,
	},
	crud: {
		select: 1,
		create: 2,
		update: 3,
		delete: 4,
	},
	json: function(res, data, err) {
		var errnum = 0,
			errmsg = err || '';

		if(
			errmsg
			&& 
			(
				(errmsg instanceof Object && JSON.stringify(errmsg).toString() != JSON.stringify({}).toString() && errmsg.toString() != [].toString())
				||
				(errmsg instanceof Array && errmsg.length > 0)
				||
				(typeof errmsg === 'string' && errmsg.length > 0)
			)
		) {
			errnum = 10000;
			data = null;
		}
		else
			errmsg = null;

		res.json({data:data, errnum:errnum, errmsg:errmsg});
	}
};

// army.io.on('connection', function (socket) {
// 	console.log('connection io');
// 	army.socket = socket;
// });

var dal = require('./db/dal.js')(army);
army.db = dal.models;
army.sequelize = dal.sequelize;
army.server = dal.server;
army.services = require('./services/CrudService')(army);

require('./controllers/ApplicationController')(army);
require('./controllers/BitacorasController')(army);
require('./controllers/CierresController')(army);
require('./controllers/ClientesController')(army);
require('./controllers/ComposicionesController')(army);
require('./controllers/ConfiguracionesController')(army);
require('./controllers/ConfiguracionesDetallesController')(army);
require('./controllers/ConsumiblesController')(army);
require('./controllers/EmpleadosController')(army);
require('./controllers/InventariosAjustesController')(army);
require('./controllers/InventariosConsumiblesController')(army);
require('./controllers/InventariosEmulsionesController')(army);
require('./controllers/InventariosMaterialesController')(army);
require('./controllers/InventariosPlantasController')(army);
require('./controllers/MantenimientosController')(army);
require('./controllers/MaquinasController')(army);
require('./controllers/MaterialesController')(army);
require('./controllers/ObrasController')(army);
require('./controllers/OperadoresMaquinasController')(army);
require('./controllers/PlantasController')(army);
require('./controllers/ProduccionesController')(army);
require('./controllers/ProductosController')(army);
require('./controllers/ProductosConsumiblesController')(army);
require('./controllers/ProspectosController')(army);
require('./controllers/SesionesController')(army);
require('./controllers/SyncController')(army);
require('./controllers/UnidadesMedidasController')(army);
require('./controllers/UsuariosController')(army);
require('./controllers/VendedoresController')(army);
require('./controllers/VendedoresProspectosController')(army);