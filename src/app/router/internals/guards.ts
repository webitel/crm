import { type RouteLocationNormalized } from 'vue-router';

import store from '../../store';

export const checkAppAccess = () => {
  const hasReadAccess = store.getters['userinfo/CHECK_APP_ACCESS'](
    store.getters['userinfo/THIS_APP'],
  );
  if (hasReadAccess) {
    return true;
  } else {
    return { path: '/access-denied' };
  }
};

export const checkRouteAccess = (to: RouteLocationNormalized) => {
  // has Role Section Access AND (Select role permissions || ObAC permissions access)
  const hasReadAccess =
    store.getters['userinfo/CHECK_OBJECT_ACCESS']({ route: to }) &&
    store.getters['userinfo/HAS_READ_ACCESS']({ name: 'contacts' });
  if (hasReadAccess) {
    return true;
  } else {
    return { path: '/access-denied' };
  }
};
