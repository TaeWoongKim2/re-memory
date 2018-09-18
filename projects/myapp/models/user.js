module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    UID: {
      type: DataTypes.STRING(100),
      primaryKey: true
    },
    PWD: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    NAME: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DATE: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'USER'
  })
);