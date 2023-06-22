// Instancio el Router que me viene en Express para poder utilizar sus funciones de enrutado
const router = require('express').Router();
// Necesito el archivo de rutas que tengo en la carpeta views para poder acceder a las rutas concretas de cada uno
const authRoutes = require('./views/authRoutes')

// Enruto utilizando esas rutas que me estoy trayendo desde authRoutes y las paso por la pre-URL /auth. Esto significa que mi URL se estructurará de la siguiente manera:
// localhost:PORT/auth/... (aquí al final irá la ruta concreta)
router.use('/auth', authRoutes);

// Exporto las rutas que he creado para poder utilizarlas en el index.js
module.exports = router;