const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');
const { v4: uuidv4 } = require('uuid');


class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    matrix_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true, 
    },
    matrix_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
