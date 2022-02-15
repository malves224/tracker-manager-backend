module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    id_menu: DataTypes.INTEGER,
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  Page.associate = (models) => {
    Page.belongsTo(models.MenuItem, {
      foreignKey: 'id_menu'
    });
  }

  return Page;
};