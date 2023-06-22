// Me importo la librería jsonwebtoken para poder utilizar los métodos correspondientes para verificar que el token es válido
const jwt = require("jsonwebtoken");

// Creo la función, el parámetro "next" que le paso es lo que me permitirá que esta función actúe como middleware, es decir, que se ejecute y luego pase directamente al controlador siguiente.
const auth = (req, res, next) => {
  try {
    // Voy a recoger el apartado de autorización de las cabeceras de la petición.
    const bearerToken = req.headers.authorization;

    // Si no existe cabecera de autenticación, directamente denegamos el paso.
    if (!bearerToken) {
      return res.json({
        succes: true,
        message: "No estás autorizado",
      });
    }
    // Si existe la cabecera, tenemos que coger el token únicamente. Para eso hacemos un split de la línea de la autenticación, que es "bearer ey349829034", por lo que al hacer un split lo pasamos a array y cogemos el elemento en la posición 1, que sería el token en sí mismo, descartando la parte de "bearer"
    const token = bearerToken.split(" ")[1];

    // Para verificar que el token se ha creado dentro de mi aplicación, con la palabra que le he pasado como secreto, utilizo el método verify de la librería jwt y le paso como primer argumento el token que he cogido de la cabecera y como segundo argumento la palabra que he usado como secreto.
    const decoded = jwt.verify(token, "secreto");

    // Aquí estoy AÑADIENDO al objeto req, al que voy a tener acceso en todas las peticiones, los campos de userId y roleId que contenía mi token (recordemos que al crear el token yo le he indicado qué campos de la tabla de usuario debe contener y bajo qué nombre, en este caso userId = user.id, roleId = user.role_id)
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;

    // Ejecuto el método next para dejar paso al siguiente controlador. Si las cosas no han ido bien habré llegado anteriormente a un return, por lo que no llegaría en ningún caso hasta esta línea.
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Token Invalid",
      error: error,
    });
  }
};

// Exporto el middleware para poder utilizarlo en mi enrutado.
module.exports = auth;