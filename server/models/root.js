'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Root extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Root.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    children: {
      type: DataTypes.STRING(4096),
      allowNull: false,
      defaultValue: '',
    }
  }, {
    sequelize,
    modelName: 'Root',
    tableName: 'roots',
  });
  return Root;
};