module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    idMenu: DataTypes.INTEGER,
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  });

  Page.associate = (models) => {
    Page.belongsTo(models.MenuItem, {
      foreignKey: 'idMenu'
    });
  }

  return Page;
};