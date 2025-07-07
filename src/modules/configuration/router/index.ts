import { CrmSections, WtObject } from '@webitel/ui-sdk/src/enums/index';
import { type RouteRecordRaw } from 'vue-router';

import TheConfiguration from '../components/the-configuration.vue';
import lookupsRoutes from '../modules/lookups/router';

const configurationRoutes: RouteRecordRaw[] = [
  {
    path: 'configuration',
    name: 'configuration',
    component: TheConfiguration,
    meta: {
      WtObject: WtObject.CrmConfiguration,
      UiSection: CrmSections.CrmConfiguration,
    },
  },
  ...lookupsRoutes,
];

export default configurationRoutes;
