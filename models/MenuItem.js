module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  return MenuItem;
};