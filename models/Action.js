module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('action', {
    idPage: DataTypes.STRING,
    entity: DataTypes.STRING,
    get: DataTypes.BOOLEAN,
    create: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    edit: DataTypes.BOOLEAN,
  }, {
    timestamps: false,
    underscored: true 
  });

  Action.associate = (models) => {
    Action.belongsTo(models.page, {
      foreignKey: 'id_page', as: 'page'
    });
  };

  return Action;
};