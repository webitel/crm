import { CrmSections } from '@webitel/ui-sdk/enums';
import { type RouteRecordRaw } from 'vue-router';

import OpenedCustomLookup from '../modules/custom-lookups/components/opened-custom-lookup.vue';
import OpenedCustomLookupColumns from '../modules/custom-lookups/components/opened-custom-lookup-columns.vue';
import OpenedCustomLookupGeneral from '../modules/custom-lookups/components/opened-custom-lookup-general.vue';
import TheCustomLookups from '../modules/custom-lookups/components/the-custom-lookups.vue';
import TheDictionaryExtensions from '../modules/wt-type-extension/components/the-wt-type-extension.vue';

const customizationRoutes: RouteRecordRaw[] = [
  {
    path: 'customization',
    name: 'customization',
    redirect: { name: 'configuration' },
    children: [
      {
        path: 'custom-lookups',
        name: CrmSections.CustomLookups,
        component: TheCustomLookups,
      },
      {
        path: 'custom-lookups/:id',
        name: `${CrmSections.CustomLookups}-card`,
        component: OpenedCustomLookup,
        redirect: { name: `${CrmSections.CustomLookups}-general` },
        children: [
          {
            path: 'general',
            name: `${CrmSections.CustomLookups}-general`,
            component: OpenedCustomLookupGeneral,
          },
          {
            path: 'columns',
            name: `${CrmSections.CustomLookups}-columns`,
            component: OpenedCustomLookupColumns,
          },
        ],
      },
      {
        path: 'types-extensions/:id',
        name: 'types-extensions',
        component: TheDictionaryExtensions,
      },
    ],
  },
];

export default customizationRoutes;
