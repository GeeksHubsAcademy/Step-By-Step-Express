// Si quiero utilizar un modelo, lo importo aquí. Lo importo desestructurado para coger únicamente uno de los modelos desde el índice.
const { user } = require("../models");

// Creo un objeto vacío para almacenar todos los controladores que voy a crear. Luego lo exportaré y accederé a cada controlador a través de los métodos que voy a crearle dentro de este archivo.
const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    // Quiero traerme todos los usuarios, por lo que utilizo directamente el método findAll sin ningún criterio concreto de búsqueda. El resultado lo almaceno en la variable users.
    let users = await user.findAll();

    // Devuelvo los datos al usuario
    res.json({
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Users not found",
        error: error,
      });
  }
};

// Exporto el objeto con todos los métodos que le he creado, para poder usarlos en mi archivo de rutas.
module.exports = userController;