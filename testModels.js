/* eslint-disable no-unused-vars */
const { AcessProfile, User } = require('./models');

 // get User
 const getUserWithPerfil = () => User.findOne(  
  { 
  where: { id: 3 }, 
  include: [{ model: AcessProfile, as: 'profile' }], 
  },
 )
  .then((response) => console.log(response.profile))
  .catch((error) => console.log(error.message));

  // get perfil e seus usuarios

  const getPerfilWithUsers = () => AcessProfile.findOne({
    where: { id: 1 },
    include: [{ model: User, as: 'users' }],
   })
   .then((response) => console.log(response));