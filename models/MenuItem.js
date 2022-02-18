module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('Menu_item', {
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  return MenuItem;
};