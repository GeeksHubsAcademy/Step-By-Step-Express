// Si quiero utilizar un modelo, lo importo aquí. Lo importo desestructurado para coger únicamente uno de los modelos desde el índice.
const { user } = require("../models");
// Importo la librería bcrypt para encriptar las contraseñas
const bcrypt = require("bcrypt");

// Importo la librería jsonwebtoken para poder generar tokens
const jsonwebtoken = require("jsonwebtoken");

// Creo un objeto vacío para almacenar todos los controladores que voy a crear. Luego lo exportaré y accederé a cada controlador a través de los métodos que voy a crearle dentro de este archivo.
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

authController.login = async (req, res) => {
    try {
      // Desestructuro el body, como sé que solo voy a tener los campos email y password, los cojo ya directamente
      const { email, password } = req.body;
      // Para poder hacer el login, primero tengo que encontrar un usuario que coincida con el email que me están pasando. Para eso envío una query de tipo findOne (encuentra uno) al modelo de usuarios, que buscará dentro de la tabla de usuarios.
      const userFound = await user.findOne({
        where: {
          email: email,
        },
      });
      // Si no encuentro un usuario al hacer esto, tiro un error de credenciales incorrectas
      if (!userFound) {
        return res.json({
          success: true,
          message: "Wrong credentials",
        });
      }
      // Si todo ha ido bien por ahora, cojo la contraseña que me están pasando por el body y utilizo el método de comparar de bcrypt para comprobar que la contraseña que me están pasando, al hashearla, coincide con la contraseña hasheada que tengo en la base de datos. Paso como argumentos primero la contraseña que estoy cogiendo del body (recordemos que está desestructurada), y después la contraseña que figura en base de datos del usuario que hemos encontrado
      const correctPassword = bcrypt.compareSync(password, userFound.password);
  
      // Si las contraseñas no coinciden, devolvemos error de credenciales incorrectas. Por seguridad, damos un error genérico en vez de decir al usuario si lo que está poniendo mal es el email o la contraseña.
      if (!correctPassword) {
        return res.json({
          success: true,
          message: "Wrong credentials",
        });
      }
  
      // Si todo ha ido bien hasta ahora, tengo que crear un token para luego poder trabajar dentro de mi página sabiendo quién es el usuario. Utilizo la librería que he importado más arriba y su método sign.
      const token = jsonwebtoken.sign(
        // Lo que va a hacer es crear un token y meter dentro, encriptada, la información que le paso en el objeto que tengo como primer argumento.
        {
          userId: userFound.id,
          roleId: userFound.role_id,
          email: userFound.email,
        },
        //   Va a usar como clave esta palabra. Lo ideal es tener la palabra almacenada en mi archivo .env para mayor privacidad, ya que este secreto es el que va a utilizar la librería para verificar los tokens de usuario que me pasen al navegar.
        "secreto",
        //   Puedo, como adicional, pasarle un tiempo de expiración
        {
          expiresIn: "3h",
        }
      );
  
      // Si todo ha salido bien, devuelvo al usuario su token, ya que deberé recogerlo en el front para poder trabajar con él.
      return res.json({
        success: true,
        message: "User logged in",
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "user cant be logged",
        error: error,
      });
    }
  };

module.exports = authController