// Necesito usar el archivo config para acceder a las credenciales de mi base de datos
const config = require('./config/config.json');
// Instancio sequelize para poder hacer la conexión con la BBDD y trabajar sobre ella
const { Sequelize } = require('sequelize');

// Coloco las credenciales provenientes del .env o de config, dependiendo de si tenemos un archivo .env o no.
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || config.development.database, 
    process.env.MYSQL_USER || config.development.username, 
    process.env.MYSQL_PASSWORD || config.development.password,
    // Tenemos que crear un objeto aparte porque estas opciones se colocan en un objeto de parámetros opcionales
    {
        host: process.env.MYSQL_HOST || config.development.host,
        port: process.env.MYSQL_PORT || config.development.port || '3306',
        dialect: 'mysql',
        operatorAliases: false,
        pool: {
            max: 5,  //maximum number of connection in pool
            min: 0,  //minimum number of connection in pool
            acquire: 30000, //maximum time, in milliseconds, that a connection can be idle before being released
            idle: 10000 // maximum time, in milliseconds, that pool will try to get connection before throwing error
        },
    }
);

// Exportamos la instanciación que hemos hecho de sequelize y ejecutamos el método authenticate para que nos autentique en la base de datos
module.exports = sequelize.authenticate()
.then((db)=>{
    // Aviso de que he conectado y me devuelvo esa conexión a la BBDD
    console.log('MYSQL connected'); 
    return db;
});