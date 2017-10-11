function CreateModels(SequelizeMod, sequelize, idPlanta) {
	var Usuarios = sequelize.define('usuarios', {
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
		folio: {
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
	});

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

	var Diarios = sequelize.define('diarios', {
		idDiario: {
			type: SequelizeMod.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idConsumible: {
			type: SequelizeMod.INTEGER
		},
		idMaterial1: {
			type: SequelizeMod.INTEGER
		},
		idMaterial2: {
			type: SequelizeMod.INTEGER
		},
		idMaterial3: {
			type: SequelizeMod.INTEGER
		},
		idMaterial4: {
			type: SequelizeMod.INTEGER
		},
		asfalto_ini: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		asfalto_fin: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material1_ini: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material1_fin: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material2_ini: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material2_fin: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material3_ini: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material3_fin: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material4_ini: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		material4_fin: {
			type: SequelizeMod.DOUBLE(18, 2)
		},
		fecha: {
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

	Composiciones.belongsTo(Productos, {foreignKey: 'idProducto', as:'producto'});
	Composiciones.belongsTo(Materiales, {foreignKey: 'idMaterial', as:'material'});

	Mantenimientos.belongsTo(Maquinas, {foreignKey: 'idMaquina', as:'maquina'});
	Mantenimientos.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});
	Mantenimientos.belongsTo(Empleados, {foreignKey: 'idEmpleado', as:'empleado'});

	InventariosConsumibles.belongsTo(Maquinas, {foreignKey: 'idMaquina', as:'maquina'});
	InventariosConsumibles.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});
	InventariosConsumibles.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});
	InventariosConsumibles.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});

	InventariosMateriales.belongsTo(Maquinas, {foreignKey: 'idMaquina', as:'maquina'});
	InventariosMateriales.belongsTo(Materiales, {foreignKey: 'idMaterial', as:'material'});
	InventariosMateriales.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});
	InventariosMateriales.belongsTo(Clientes, {foreignKey: 'idCliente', as:'cliente'});
	InventariosMateriales.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});
	InventariosMateriales.belongsTo(InventariosAjustes, {foreignKey: 'idInventarioAjuste', as:'inventario_ajuste'});
	

	Producciones.belongsTo(Productos, {foreignKey: 'idProducto', as:'producto'});
	Producciones.belongsTo(Clientes, {foreignKey: 'idCliente', as:'cliente'});
	Producciones.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});
	Producciones.belongsTo(Empleados, {foreignKey: 'idEmpleado', as:'empleado'});
	Producciones.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});

	OperadoresMaquinas.belongsTo(Empleados, {foreignKey: 'idEmpleado', as:'empleado'});
	OperadoresMaquinas.belongsTo(Maquinas, {foreignKey: 'idMaquina', as:'maquina'});

	Maquinas.belongsTo(UnidadesMedida, {foreignKey: 'idUnidadMedida', as:'unidad_medida'});

	InventariosEmulsiones.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});
	InventariosEmulsiones.belongsTo(Clientes, {foreignKey: 'idCliente', as:'cliente'});
	InventariosEmulsiones.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});

	InventariosPlantas.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});
	InventariosPlantas.belongsTo(Producciones, {foreignKey: 'idProduccion', as:'produccion'});
	InventariosPlantas.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});
	InventariosPlantas.belongsTo(InventariosAjustes, {foreignKey: 'idInventarioAjuste', as:'inventario_ajuste'});
	InventariosPlantas.belongsTo(Clientes, {foreignKey: 'idCliente', as:'cliente'});
	InventariosPlantas.belongsTo(Obras, {foreignKey: 'idObra', as:'obra'});
	
	InventariosAjustes.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});
	InventariosAjustes.belongsTo(Materiales, {foreignKey: 'idMaterial', as:'material'});
	InventariosAjustes.belongsTo(Cierres, {foreignKey: 'idCierre', as:'cierre'});

	Usuarios.hasMany(MenusUsuarios, {foreignKey: 'idUsuario', as:'menus_usuaios'});

	VendedoresProspectos.belongsTo(Vendedores, {foreignKey: 'idVendedor', as:'vendedor'});
	VendedoresProspectos.belongsTo(Prospectos, {foreignKey: 'idProspecto', as:'prospecto'});
	Bitacoras.belongsTo(VendedoresProspectos, {foreignKey: 'idVendedorProspecto', as:'vendedor_prospecto'});

	ConfiguracionesDetalles.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});
	ConfiguracionesDetalles.belongsTo(Configuraciones, {foreignKey: 'idConfiguracion', as:'configuracion'});

	Materiales.belongsTo(InventariosMateriales, {foreignKey: 'idMaterial', as:'inventarios_materiales'});

	ProductosConsumibles.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});

	Productos.belongsTo(ProductosConsumibles, {foreignKey: 'idProducto', as:'productos_consumibles'});

	Diarios.belongsTo(Consumibles, {foreignKey: 'idConsumible', as:'consumible'});
	Diarios.belongsTo(Materiales, {foreignKey: 'idMaterial1', as:'material1'});
	Diarios.belongsTo(Materiales, {foreignKey: 'idMaterial2', as:'material2'});
	Diarios.belongsTo(Materiales, {foreignKey: 'idMaterial3', as:'material3'});
	Diarios.belongsTo(Materiales, {foreignKey: 'idMaterial4', as:'material4'});


	Usuarios.hasMany(MenusUsuarios, {as:'menus_usuaios', foreignKey:'idUsuario'});
	MenusUsuarios.belongsTo(Usuarios, {as:'usuarios', foreignKey:'idUsuario'});

	Producciones.hasMany(InventariosMateriales, {foreignKey: 'idProduccion', as:'inventarios_materiales'});
	InventariosMateriales.belongsTo(Producciones, {foreignKey: 'idProduccion', as:'produccion'});

	var models = {
		bitacoras: Bitacoras,
		cierres: Cierres,
		clientes: Clientes,
		composiciones: Composiciones,
		configuraciones: Configuraciones,
		configuraciones_detalles: ConfiguracionesDetalles,
		consumibles: Consumibles,
		diarios: Diarios,
		empleados: Empleados,
		inventarios_ajustes: InventariosAjustes,
		inventarios_consumibles: InventariosConsumibles,
		inventarios_emulsiones: InventariosEmulsiones,
		inventarios_materiales: InventariosMateriales,
		inventarios_plantas: InventariosPlantas,
		mantenimientos: Mantenimientos,
		maquinas: Maquinas,
		materiales: Materiales,
		menus_n1: MenusN1,
		menus_n2: MenusN2,
		menus_paginas: MenusPaginas,
		menus_usuaios: MenusUsuarios,
		obras: Obras,
		operadores_maquinas: OperadoresMaquinas,
		plantas: Plantas,
		producciones: Producciones,
		productos: Productos,
		prospectos: Prospectos,
		unidades_medidas: UnidadesMedida,
		usuarios: Usuarios,
		vendedores: Vendedores,
		vendedores_prospectos: VendedoresProspectos,
	};

	return models;
}

module.exports = function dal(army) {
	var SequelizeMod = require('sequelize');

	//var sequelize = new SequelizeMod('mysql://admin_server:JXAJ8D4pLBQBfdfv@local.arvumti.com/admin_tajsa_dev');
	//var sequelize = new SequelizeMod('mysql://root@local.arvumti.com/admin_tajsa_dev');
	//var sequelize = new SequelizeMod('admin_tajsa_dev', 'admin_server', 'JXAJ8D4pLBQBfdfv', {
	var sequelize = new SequelizeMod('admin_tajsa_dev', 'root', '', {
		host: '127.0.0.1',
		dialect: 'mysql',
		logging: null,
		pool: {
			idle: 10000
		},
	});
	//var sequelize_server = new SequelizeMod('mysql://root@local.arvumti.com/admin_tajsa_prod');
	//var sequelize_server = new SequelizeMod('admin_tajsa_prod', 'admin_sync', 'TJSA#vps-15', {
	var sequelize_server = new SequelizeMod('admin_tajsa_sync', 'army', 'A@rmy_6102', {
	//var sequelize_server = new SequelizeMod('admin_tajsa_prod', 'root', '', {
		host: 'virtual.armedigital.com',
		//host: 'null',
		dialect: 'mysql',
		logging: null,
		pool: {
			idle: 10000
		},
	});

	var models = CreateModels(SequelizeMod, sequelize, army.config.idPlanta);
	var models_server = CreateModels(SequelizeMod, sequelize_server, null);

	return {
		models:models,
		sequelize:sequelize,
		server: {
			models: models_server,
			sequelize: sequelize_server,
		},
	};
};