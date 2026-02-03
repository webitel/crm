import { fillIconsRepository } from '@webitel/ui-sdk';

import crmLookups from './crm-lookups.svg?raw';
import crmCustomization from './crm-customization.svg?raw';

const icons = {
  'crm-lookups': crmLookups,
  'crm-customization': crmCustomization,
};

fillIconsRepository({ icons: Object.entries(icons).map(([iconName, svg]) => ({ iconName, svg })) });
