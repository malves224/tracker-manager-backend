module.exports = (sequelize, DataTypes) => {
  const AcessProfile = sequelize.define('Acess_profile', {
    name: DataTypes.STRING,
  });

  return AcessProfile;
};