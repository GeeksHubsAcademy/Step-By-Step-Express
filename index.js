// Recojo express para poder levantar un servidor
const express = require("express")

// Creo mi aplicación a partir de la instanciación de express
const app = express()

// Defino el puerto de conexión
const PORT = 3000;

// Levanto el servidor e informo al usuario de lo que está ocurriendo
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})