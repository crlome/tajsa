var SequelizeMod = require('sequelize');
var idPlanta = null;
//var sequelize = new SequelizeMod('mysql://admin_server:JXAJ8D4pLBQBfdfv@local.arvumti.com/admin_tajsa_dev');
var sequelize = new SequelizeMod('mysql://root@127.0.0.1/admin_tajsa_dev');
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