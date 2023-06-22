// Instancio el elemento Router para poder usar las funciones de enrutado de Express
const router = require('express').Router();
// Importo los controladores que tengo dentro de mi carpeta de controladores y concretamente de mi archivo de controladores de autenticación
const authController = require('../controllers/authController')

// Creo las rutas utilizando los métodos que correspondan, en este caso ambas son de tipo POST (siempre la autenticación será de tipo POST). El segundo argumento es la función que me viene del archivo de controladores.
router.post('/register', authController.register);
router.post('/login', authController.login);

// Exporto para poder utilizar esto dentro del archivo router.js
module.exports = router;