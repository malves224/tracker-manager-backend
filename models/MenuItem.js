module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('menu_item', {
    name: DataTypes.STRING,
  }, { underscored: true });

  MenuItem.associate = (models) => {
    MenuItem.hasMany(models.page, {
      foreignKey: 'id_menu', as: 'pages'
    });
  }

  return MenuItem;
};