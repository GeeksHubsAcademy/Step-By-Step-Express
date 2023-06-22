// Recojo express para poder levantar un servidor
const express = require("express")

// Recojo la conexión a la base de datos que he hecho en el archivo db.js
const db = require("./db");

// Si quiero utilizar un modelo, lo importo aquí. Lo importo desestructurado para coger únicamente uno de los modelos desde el índice.
const { user } = require("./models");

// Importo la librería bcrypt para encriptar las contraseñas
const bcrypt = require("bcrypt");

// Creo mi aplicación a partir de la instanciación de express
const app = express()

// Esto me permite utilizar bodys de tipo JSON - OJO, SIN ESTO NO FUNCIONARÁN LAS PETICIONES DE TIPO POST
app.use(express.json());

// Defino el puerto de conexión
const PORT = 3000;

// Voy a empezar a crear aquí los controladores que luego exportaré a sus propias carpetas

// El controlador es de tipo POST, para enviar datos, el primer argumento incluye la URL y el segundo la función que va a realizar el controlador en sí
app.post("/register", async (req, res) => {
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
});


// Si se ha realizado la conexión a la base de datos (que se está realizando en el archivo db.js)
db.then(() => {
    // ...entonces levanto el servidor e informo al usuario de lo que está ocurriendo
  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
})
// Si hay un error, informo al usuario
.catch((error) => console.error(error.message));