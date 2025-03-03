import { type RouteRecordRaw } from 'vue-router';

import TheConfiguration from '../components/the-configuration.vue';
import lookupsRoutes from '../modules/lookups/router';

const configurationRoutes: RouteRecordRaw[] = [
  {
    path: 'configuration',
    name: 'configuration',
    component: TheConfiguration,
    // beforeEnter: checkRouteAccess,
  },
  ...lookupsRoutes,
];

export default configurationRoutes;
