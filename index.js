// Recojo express para poder levantar un servidor
const express = require("express")

// Recojo la conexión a la base de datos que he hecho en el archivo db.js
const db = require("./db");

// Creo mi aplicación a partir de la instanciación de express
const app = express()

// Defino el puerto de conexión
const PORT = 3000;

// Si se ha realizado la conexión a la base de datos (que se está realizando en el archivo db.js)
db.then(() => {
    // ...entonces levanto el servidor e informo al usuario de lo que está ocurriendo
  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
})
// Si hay un error, informo al usuario
.catch((error) => console.error(error.message));