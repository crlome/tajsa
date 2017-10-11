var SequelizeMod = require('sequelize');
var idPlanta = null;
//var sequelize = new SequelizeMod('mysql://admin_server:JXAJ8D4pLBQBfdfv@local.arme.com/admin_tajsa_dev');
var sequelize = new SequelizeMod('mysql://admin_tajsa:xpThp2CTZB@local.arme.com/admin_tajsa_dev');
//var sequelize = new SequelizeMod('mysql://root@127.0.0.1/admin_tajsa_dev');
//var sequelize = new SequelizeMod('mysql://root@local.arvumti.com/admin_tajsa_prod');
//var sequelize = new SequelizeMod('mysql://admin_sync:TJSA#vps-15@virtual.armedigital.com/admin_tajsa_prod');
// var sequelize = new SequelizeMod('admin_tajsa_prod', 'admin_sync', 'TJSA#vps-15', {
// 	host: 'virtual.armedigital.com',
// 	dialect: 'mysql',
// 	//logging: null,
// 	pool: {
// 		idle: 10000
// 	},
// });

var army = {
	sequelize: SequelizeMod,
};

/*========================== BEGIN TABLAS ==========================*/
	/*var Usuarios = sequelize.define('usuarios', {
		idUsuario: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING
		},
		contrasenia: {
			type: SequelizeMod.STRING
		},
		usuario: {
			type: SequelizeMod.STRING
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Plantas = sequelize.define('plantas', {
		idPlanta: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var MenusN1 = sequelize.define('menus_n1', {
		idMenuN1: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	}, {
		tableName: 'menus_n1',
	});
	var MenusN2 = sequelize.define('menus_n2', {
		idMenuN2: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idMenuN1: {
			type: SequelizeMod.INTEGER
		},
		nombre: {
			type: SequelizeMod.STRING
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	}, {
		tableName: 'menus_n2',
	});
	var MenusPaginas = sequelize.define('menus_paginas', {
		idMenuPagina: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idMenuN1: {
			type: SequelizeMod.INTEGER
		},
		idMenuN2: {
			type: SequelizeMod.INTEGER
		},
		pagina: {
			type: SequelizeMod.STRING(250)
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var MenusUsuarios = sequelize.define('menus_usuarios', {
		idMenuUsuario: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idUsuario: {
			type: SequelizeMod.INTEGER
		},
		idMenuPagina: {
			type: SequelizeMod.INTEGER
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});


	var Materiales = sequelize.define('materiales', {
		idMaterial: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Productos = sequelize.define('productos', {
		idProducto: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		precio: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		observaciones: {
			type: SequelizeMod.STRING(500)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Composiciones = sequelize.define('composiciones', {
		idComposicion: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idProducto: {
			type: SequelizeMod.INTEGER
		},
		idMaterial: {
			type: SequelizeMod.INTEGER
		},
		porcentaje: {
			type: SequelizeMod.INTEGER
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Clientes = sequelize.define('clientes', {
		idCliente: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(500)
		},
		clave: {
			type: SequelizeMod.STRING(10)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Consumibles = sequelize.define('consumibles', {
		idConsumible: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		produccion: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		tipo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Mantenimientos = sequelize.define('mantenimientos', {
		idMantenimiento: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idMaquina: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		idEmpleado: {
			type: SequelizeMod.INTEGER
		},
		fecha: {
			type: SequelizeMod.DATE
		},
		cambioAceite: {
			type: SequelizeMod.INTEGER
		},
		cambioFiltroAceite: {
			type: SequelizeMod.INTEGER
		},
		cambioFiltroAire: {
			type: SequelizeMod.INTEGER
		},
		cambioAceiteHidraulico: {
			type: SequelizeMod.INTEGER
		},
		cambioFiltroHidraulico: {
			type: SequelizeMod.INTEGER
		},
		soploFiltroAire: {
			type: SequelizeMod.INTEGER
		},
		engrasadoMaquinaria: {
			type: SequelizeMod.INTEGER
		},
		cargaDiesel: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		cargaAceiteHidraulico: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		cargaAceiteMotor: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		lavadoMaquinaria: {
			type: SequelizeMod.INTEGER
		},
		kilometraje: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		observaciones: {
			type: SequelizeMod.STRING(1000)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var InventariosConsumibles = sequelize.define('inventarios_consumibles', {
		idInventarioConsumible: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idMaquina: {
			type: SequelizeMod.INTEGER
		},
		idConsumible: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		orden: {
			type: SequelizeMod.INTEGER
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		w15: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		hd68: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		hora: {
			type: SequelizeMod.STRING(5)
		},
		horometro: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		grasa: {
			type: SequelizeMod.INTEGER
		},
		tipo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var InventariosMateriales = sequelize.define('inventarios_materiales', {
		idInventarioMaterial: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idMaquina: {
			type: SequelizeMod.INTEGER
		},
		idMaterial: {
			type: SequelizeMod.INTEGER
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		idProduccion: {
			type: SequelizeMod.INTEGER
		},
		idInventarioAjuste: {
			type: SequelizeMod.INTEGER
		},
		idCliente: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		kmSubsecuente: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		tarifaA: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		impAcarreo: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		precio: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		folio: {
			type: SequelizeMod.INTEGER
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		capacidad: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		impMatPetreo: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		km: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		tarifaB: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		hora: {
			type: SequelizeMod.STRING(5)
		},
		tipo: {
			type: SequelizeMod.INTEGER, 
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var InventariosEmulsiones = sequelize.define('inventarios_emulsiones', {
		idInventarioEmulsion: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		idCliente: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		hora: {
			type: SequelizeMod.STRING(5)
		},
		observaciones: {
			type: SequelizeMod.STRING(1000)
		},
		lugar: {
			type: SequelizeMod.STRING
		},
		litrosIniciales: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		litrosTendidos: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		metrosTendidos: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		rpm: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		tipo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var InventariosPlantas = sequelize.define('inventarios_plantas', {
		idInventarioPlanta: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idConsumible: {
			type: SequelizeMod.INTEGER
		},
		idProduccion: {
			type: SequelizeMod.INTEGER
		},
		idCliente: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		idInventarioAjuste: {
			type: SequelizeMod.INTEGER
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		metros: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		valor: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		tipo_asfalto: {
			type: SequelizeMod.INTEGER,
			defaultValue: 0,
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		hora: {
			type: SequelizeMod.STRING(5)
		},
		tipo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var InventariosAjustes = sequelize.define('inventarios_ajustes', {
		idInventarioAjuste: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idConsumible: {
			type: SequelizeMod.INTEGER
		},
		idMaterial: {
			type: SequelizeMod.INTEGER
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		tipo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Obras = sequelize.define('obras', {
		idObra: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(500)
		},
		clave: {
			type: SequelizeMod.STRING(10)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Empleados = sequelize.define('empleados', {
		idEmpleado: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		apaterno: {
			type: SequelizeMod.STRING(100)
		},
		amaterno: {
			type: SequelizeMod.STRING(100)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Producciones = sequelize.define('producciones', {
		idProduccion: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idProducto: {
			type: SequelizeMod.INTEGER
		},
		idCliente: {
			type: SequelizeMod.INTEGER
		},
		idObra: {
			type: SequelizeMod.INTEGER
		},
		idEmpleado: {
			type: SequelizeMod.INTEGER
		},
		idCierre: {
			type: SequelizeMod.INTEGER
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		hora: {
			type: SequelizeMod.STRING(5),
		},
		cantidad: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		folio: {
			type: SequelizeMod.INTEGER
		},
		placas: {
			type: SequelizeMod.STRING(50)
		},
		tipo: {
			type: SequelizeMod.INTEGER, 
			defaultValue: 1,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var OperadoresMaquinas = sequelize.define('operadores_maquinas', {
		idOperadorMaquina: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idEmpleado: {
			type: SequelizeMod.INTEGER
		},
		idMaquina: {
			type: SequelizeMod.INTEGER
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Maquinas = sequelize.define('maquinas', {
		idMaquina: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idUnidadMedida: {
			type: SequelizeMod.INTEGER
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		clave: {
			type: SequelizeMod.STRING(10)
		},
		placa: {
			type: SequelizeMod.STRING(50)
		},
		tipo: {
			type: SequelizeMod.INTEGER
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Cierres = sequelize.define('cierres', {
		idCierre: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		fechaIni: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		fechaFin: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var UnidadesMedida = sequelize.define('unidades_medidas', {
		idUnidadMedida: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(50)
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Configuraciones = sequelize.define('configuraciones', {
		idConfiguracion: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		fecha_actualizacion: {
			type: SequelizeMod.DATE
		},
		capacidad_gas: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		capacidad_gas_amarillo: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var ConfiguracionesDetalles = sequelize.define('configuraciones_detalles', {
		idConfiguracionDetalle: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idConfiguracion: {
			type: SequelizeMod.INTEGER,
		},
		idConsumible: {
			type: SequelizeMod.INTEGER,
		},
		valor: {
			type: SequelizeMod.DOUBLE(18, 2),
			defaultValue: 0,
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});

	var Vendedores = sequelize.define('vendedores', {
		idVendedor: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		apaterno: {
			type: SequelizeMod.STRING(100)
		},
		amaterno: {
			type: SequelizeMod.STRING(100)
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Prospectos = sequelize.define('prospectos', {
		idProspecto: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: SequelizeMod.STRING(100)
		},
		apaterno: {
			type: SequelizeMod.STRING(100)
		},
		amaterno: {
			type: SequelizeMod.STRING(100)
		},
		empresa: {
			type: SequelizeMod.STRING(1000)
		},
		telefono: {
			type: SequelizeMod.STRING(30)
		},
		celular: {
			type: SequelizeMod.STRING(30)
		},
		email: {
			type: SequelizeMod.STRING(128)
		},
		observaciones: {
			type: SequelizeMod.STRING(1000)
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var VendedoresProspectos = sequelize.define('vendedores_prospectos', {
		idVendedorProspecto: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idVendedor: {
			type: SequelizeMod.INTEGER
		},
		idProspecto: {
			type: SequelizeMod.INTEGER
		},
		status: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
	var Bitacoras = sequelize.define('bitacoras', {
		idBitacora: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idVendedorProspecto: {
			type: SequelizeMod.INTEGER
		},
		comentario: {
			type: SequelizeMod.STRING(1000)
		},
		fecha: {
			type: SequelizeMod.DATE, 
			defaultValue: SequelizeMod.NOW,
		},
		importante: {
			type: SequelizeMod.INTEGER,
			defaultValue: 0,
		},
		idPlanta: {
			type: SequelizeMod.INTEGER,
			defaultValue: idPlanta,
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});*/
	var ProductosConsumibles = sequelize.define('productos_consumibles', {
		idProductoConsumible: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idProducto: {
			type: SequelizeMod.INTEGER
		},
		idConsumible: {
			type: SequelizeMod.INTEGER
		},
		valor: {
			type: SequelizeMod.INTEGER
		},
		idPrimSync: {
			type: SequelizeMod.INTEGER
		},
		idPlanta: {
			type: SequelizeMod.INTEGER
		},
		activo: {
			type: SequelizeMod.INTEGER,
			defaultValue: 1,
		},
	});
/*========================== END TABLAS ==========================*/

sequelize.sync().then(function() {
	console.log('ok');
  // return User.create({
  //   username: 'janedoe',
  //   birthday: new Date(1980, 6, 20)
  // });
}).then(function(jane) {
  // console.log(jane.get({
  //   plain: true
  // }));
});