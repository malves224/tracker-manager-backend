module.exports = (sequelize, DataTypes) => {
  const AcessPermission = sequelize.define('AcessPermission',
    { id_perfil: DataTypes.INTEGER, 
      id_page: DataTypes.INTEGER,
      edit: DataTypes.BOOLEAN,
      delete: DataTypes.BOOLEAN,
      create: DataTypes.BOOLEAN,
    },
    { timestamps: false });

  AcessPermission.associate = (models) => {
    models.Page.belongsToMany(models.AcessProfile, {
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