module.exports = (sequelize, DataTypes) => {
  const AcessPermission = sequelize.define('acess_permission',
    { idPerfil: DataTypes.INTEGER, 
      idPage: DataTypes.INTEGER,
      edit: DataTypes.BOOLEAN,
      delete: DataTypes.BOOLEAN,
      create: DataTypes.BOOLEAN,
    },
    { timestamps: false, underscored: true });

  AcessPermission.associate = (models) => {
    models.page.belongsToMany(models.acess_profile, {
      through: AcessPermission,
      foreignKey: 'id_perfil',
      as: 'profiles',
      otherKey: 'id_page',
    });
    models.acess_profile.belongsToMany(models.page, {
      through: AcessPermission,
      foreignKey: 'id_page',
      as: 'pages',
      otherKey: 'id_perfil',
    });
  };

  return AcessPermission;
};