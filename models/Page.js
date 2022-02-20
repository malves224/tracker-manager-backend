module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
    id_menu: DataTypes.INTEGER,
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  Page.associate = (models) => {
    Page.belongsTo(models.menu_item, {
      foreignKey: 'id_menu'
    });
  }

  return Page;
};