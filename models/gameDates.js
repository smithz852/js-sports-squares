const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class GameDates extends Model {}

GameDates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sportdate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "gameDates",
  }
);

module.exports = GameDates;