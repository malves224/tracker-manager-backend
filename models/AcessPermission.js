module.exports = (sequelize, DataTypes) => {
  const AcessPermission = sequelize.define('AcessPermission',
    { idPerfil: DataTypes.INTEGER, idPage: DataTypes.INTEGER },
    { timestamps: false });

  AcessPermission.associate = (models) => {
    models.Page.belongsToMany(models.AcessProfile, {
      through: AcessPermission,
      foreignKey: 'idPerfil',
      as: 'profiles',
      otherKey: 'idPage',
    });
    models.AcessProfile.belongsToMany(models.Page, {
      through: AcessPermission,
      foreignKey: 'idPage',
      as: 'pages',
      otherKey: 'idPerfil',
    });
  };

  return AcessPermission;
};