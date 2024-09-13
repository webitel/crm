import store from "../../store/index.js";

export const checkAppAccess = (to, from, next) => {
  // check for === false because it can be undefined
  if (to.meta.requiresAccess === false) next();

  const hasReadAccess = store.getters['userinfo/CHECK_APP_ACCESS'](store.getters['userinfo/THIS_APP']);
  if (hasReadAccess) {
    next();
  } else {
    next();
    // next('/access-denied');
  }
};

export const checkRouteAccess = (to, from, next) => {
  const hasReadAccess = store.getters['userinfo/HAS_READ_ACCESS']({ route: to });
  if (hasReadAccess) {
    next();
  } else {
    next();
    console.log('error?')
    // next('/access-denied');
  }
};
