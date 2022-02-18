module.exports = (sequelize, DataTypes) => {
  const AcessPermission = sequelize.define('Acess_permission',
    { idPerfil: DataTypes.INTEGER, 
      idPage: DataTypes.INTEGER,
      edit: DataTypes.BOOLEAN,
      delete: DataTypes.BOOLEAN,
      create: DataTypes.BOOLEAN,
    },
    { timestamps: false, underscored: true });

  AcessPermission.associate = (models) => {
    models.Page.belongsToMany(models.Acess_profile, {
      through: AcessPermission,
      foreignKey: 'id_page',
      as: 'profiles',
      otherKey: 'id_perfil',
    });
    models.AcessProfile.belongsToMany(models.Page, {
      through: AcessPermission,
      foreignKey: 'id_perfil',
      as: 'pages',
      otherKey: 'id_page',
    });
  };

  return AcessPermission;
};