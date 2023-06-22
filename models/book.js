'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
      models.book.belongsToMany(models.user, {
        through: "favorites",
        foreignKey: "book_id",
      });
    }
  }
  book.init({
    title: DataTypes.STRING,
    genre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};