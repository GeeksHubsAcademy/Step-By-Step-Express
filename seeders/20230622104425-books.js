"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Dentro del comando "up" se coloca lo que queremos que ocurra al lanzar el comando db:seed
  async up(queryInterface, Sequelize) {
    // Hago un insert en bulk a la tabla que le indico en el primer argumento, en el segundo coloco ya la información como tal dentro de un array de objetos. Cada objeto es un registro dentro de la tabla.
    await queryInterface.bulkInsert(
      "books",
      [
        {
          // Tengo que meter TODOS los campos, incluyendo ids y timestamps.
          id: 1,
          title: "Libro 1",
          genre: "Misterio",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Libro 2",
          genre: "Romance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("books", null, {});
  },
};
