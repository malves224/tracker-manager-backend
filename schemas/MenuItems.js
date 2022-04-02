const checkPermision = (routeForCheck, pagesAllowed) => pagesAllowed
  .some((permItem) => routeForCheck === permItem.page.route);

const checkIfExistMenuNav = (MenuNav, id) => MenuNav
  .some((item) => item.id === id);

const getItemsNavAllowed = (pagesAllowed, allItemsWithPages) => {
  const ItemsWithPagesAllowed = [];
  allItemsWithPages.forEach(({ pages, id, name: nameMenu }, index) => {
    pages.forEach(({ name, route }) => {
      if (checkPermision(route, pagesAllowed)) {
        if (!checkIfExistMenuNav(ItemsWithPagesAllowed, id)) {
          const newItemMenuAllowed = { id, name: nameMenu, pages: [{ name, route }] };
          ItemsWithPagesAllowed.push(newItemMenuAllowed);
          return;
        }
        return ItemsWithPagesAllowed[index].pages.push({ name, route });
      }
    });
  });
  return ItemsWithPagesAllowed;
};

module.exports = {
  getItemsNavAllowed,
};
