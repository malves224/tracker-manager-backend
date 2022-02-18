module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    idPerfil: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    occupation: DataTypes.STRING,
    contact: DataTypes.STRING,
  },
  {underscored: true });

   User.associate = (models) => {
    User.belongsTo(models.Acess_profile, {
      foreignKey: 'id_perfil', as: 'profile'
    })
   }

  return User;
};