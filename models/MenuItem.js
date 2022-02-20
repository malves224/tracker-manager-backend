module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('menu_item', {
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  return MenuItem;
};