// Si quiero utilizar un modelo, lo importo aquí. Lo importo desestructurado para coger únicamente uno de los modelos desde el índice.
const { user } = require("../models");
// Importo la librería bcrypt para encriptar las contraseñas
const bcrypt = require("bcrypt");

const authController = {}

authController.register = async (req, res) => {
    // Recojo el body, podría desestructurarlo también para coger cada elemento directamente
  let body = req.body;
//   Encripto la contraseña antes de pasarla a la base de datos para no tener datos sin proteger
  const newPass = bcrypt.hashSync(body.password, 10);

  try {
    // llamo al modelo con el método create del ORM. Esto va a crear un nuevo registro en la tabla, por lo que le tengo que indicar cada uno de los campos que tiene que rellenar. Le paso cada campo desde el body y, si quiero rellenar alguno de manera predeterminada, se lo puedo decir directamente.
    const newUser = await user.create({
      username: body.username,
      email: body.email,
    //   Le paso la contraseña encriptada en vez de la que me han pasado por el body
      password: newPass,
    //   Le asigno directamente el rol de usuario, no quiero que se puedan registrar administradores
      role_id: 2
    });

    // Devuelvo como respuesta un mensaje y los datos del usuario nuevo que acabo de crear, que había almacenado en la variable "newUser"
    return res.json({
      message: "Usuario creado",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = authController