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
      foreignKey: 'id_page',
      as: 'profiles',
      otherKey: 'id_perfil',
    });
    models.acess_profile.belongsToMany(models.page, {
      through: AcessPermission,
      foreignKey: 'id_perfil',
      as: 'pages',
      otherKey: 'id_page',
    });
  };

  return AcessPermission;
};