const { page, action } = require('../models');
const { verifyPermissionAcess, getPagesAllowedByPerfil } = require('./util');

const allPageLoading = () => page.findAll({ 
  attributes: ['id', 'name', 'route'],
  include: { 
    model: action, 
    as: 'actions',
    attributes: { exclude: ['id_page'] },
   },
});

const getAllPages = async (idPerfil) => {
  const perfilHasAcesso = await verifyPermissionAcess(idPerfil, 'pages');
  if (!perfilHasAcesso) {
    return { message: 'Usuario não autorizado.' };
  }
  try {
    const allPages = await allPageLoading();
    return allPages;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllPages,
  getPagesAllowedByPerfil,
};