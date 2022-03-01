module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
    idMenu: DataTypes.INTEGER,
    name: DataTypes.STRING,
    route: DataTypes.STRING,
  }, { underscored: true });

  Page.associate = (models) => {
    Page.belongsTo(models.menu_item, {
      foreignKey: 'id_menu', as: 'menuItems'
    });
    Page.hasMany(models.action, {
      foreignKey:'id_page', as: 'actions',
    })
    models.acess_permission .belongsTo(Page, {
      through: models.acess_permission,
      foreignKey: 'id_page', as: 'page',
      otherKey: 'id_page',
    });
  }

  return Page;
};