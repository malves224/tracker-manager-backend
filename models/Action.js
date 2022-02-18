module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('action', {
    idPage: DataTypes.STRING,
    entity: DataTypes.STRING,
    get: DataTypes.BOOLEAN,
    create: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    edit: DataTypes.BOOLEAN,
  }, {
    timestamps: false
  });

  Action.associate = (models) => {
    Action.hasOne(models.page, {
      foreignKey: 'idPage', as: 'action'
    });
  };

  return Action;
};