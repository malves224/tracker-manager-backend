module.exports = (sequelize, DataTypes) => {
  const AcessProfile = sequelize.define('acess_profile', {
    name: DataTypes.STRING,
  });

  return AcessProfile;
};