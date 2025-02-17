export const checkDisableState = (item, target) => {
  // If the item is a root element, we didn't need to check the state of the services
  if (!item.service?.length) {
    return false;
  }

  // if item is a root element and has a state, then we need to check the state of the services
  if (!item.state) {
    return true;
  }

  // If a target item is in a service array, we need return false
  if (item.service.some((service) => service.id === target.id)) {
    return false;
  }

  return item.service.some((service) => checkDisableState(service, target));
};
