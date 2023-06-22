// Si quiero utilizar un modelo, lo importo aquí. Lo importo desestructurado para coger únicamente uno de los modelos desde el índice.
const { user, role, book } = require("../models");

// Creo un objeto vacío para almacenar todos los controladores que voy a crear. Luego lo exportaré y accederé a cada controlador a través de los métodos que voy a crearle dentro de este archivo.
const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    // Quiero traerme todos los usuarios, por lo que utilizo directamente el método findAll sin ningún criterio concreto de búsqueda. El resultado lo almaceno en la variable users.
    let users = await user.findAll({
        // Si quiero excluir algún campo, lo incluyo aquí
        attributes: {
          exclude: ["password"]
        },
        // Si quiero incluir los datos de una tabla relacionada, también lo pongo aquí
        include: [
          {model: role}
        ]
      });

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

userController.updateUser = async (req, res) => {
    try {
      // Recojo los datos del body
      const body = req.body;
      // Recojo la id del usuario del token. Si utilizo esto para encontrar a mi usuario aseguro que solo puedo editar MI perfil, del usuario que está logueado.
      const userId = req.userId;
  
      // Elimino del body los campos que sé que no quiero poder cambiar. De mi usuario no me interesa que nunca se pueda cambiar ni el email, ni la contraseña ni el nombre de usuario. Quizá luego crearía otro controlador únicamente para cambiar la contraseña.
      delete body.email;
      delete body.password;
      delete body.username;
  
      // Utilizo el método update del modelo user para actualizar los datos.
      await user.update(
        // En este primer objeto recojo los elementos del body y los cambio dentro del usuario.
        {
          name: body.name,
          surname: body.surname,
        },
        //   Busco el usuario que quiero actualizar. Al hacerlo desde el token directamente aseguro que estoy editando mi usuario y ningún otro.
        {
          where: {
            id: userId,
          },
        }
      );
  
      // Si todo ha ido bien, devuelvo un mensaje al usuario. En este caso no almaceno nada como datos ni lo devuelvo porque la respuesta del método update es un booleano.
      res.json({
        message: "User updated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Could not update user",
        error: error,
      });
    }
  };

  userController.getFavorites = async (req, res) => {
    try {
      // Recojo la id del usuario del token. Si utilizo esto para encontrar a mi usuario aseguro que solo puedo editar MI perfil, del usuario que está logueado.
      let userId = req.userId
  
      // Recojo de la tabla de usuarios MIS favoritos usando la ID que tengo en el token e incluyendo el modelo libros.
      let favorites = await user.findOne({
        include: {
          model: book
        },
        where: {
          id: userId
        }
      })
  
      // Devuelvo los resultados al usuario
      res.json({
        message: "User found",
        data: favorites
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Could not find favorites",
        error: error,
      });
    }
  }

// Exporto el objeto con todos los métodos que le he creado, para poder usarlos en mi archivo de rutas.
module.exports = userController;