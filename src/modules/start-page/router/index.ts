import { type RouteRecordRaw } from 'vue-router';

import TheStartPage from '../components/the-start-page.vue';
import RouteNames from './internals/start-page-route-names.enum';
import RoutePaths from './internals/start-page-route-paths.enum';

const startPageRoutes: RouteRecordRaw[] = [
  {
    path: RoutePaths.TheStartPage,
    name: RouteNames.TheStartPage,
    component: TheStartPage,
  },
];

export default startPageRoutes;
