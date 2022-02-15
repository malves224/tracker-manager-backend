module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_perfil: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
  });

   User.associate = (models) => {
    User.belongsTo(models.AcessProfile, {
      foreignKey: 'id_perfil', as: 'profile'
    })
   }

  return User;
};