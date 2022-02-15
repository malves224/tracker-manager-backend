module.exports = (sequelize, DataTypes) => {
  const AcessProfile = sequelize.define('AcessProfile', {
    name: DataTypes.STRING,
  });


   AcessProfile.associate = (models) => {
    AcessProfile.hasMany(models.User, {
      foreignKey: 'id_perfil', as: 'users',
    })
   }

  return AcessProfile;
};