module.exports = (sequelize, DataTypes) => {
  const AcessProfile = sequelize.define('AcessProfile', {
    name: DataTypes.STRING,
  });

  return AcessProfile;
};